import sys
import os
import pefile
from cpp_demangle import demangle
from pathlib import Path

dll_proxy_template = """
#include <windows.h>
#include <stdio.h>
#include <filesystem>
#include <mutex>

extern "C" {{
    FILE *logfile = NULL;
    std::mutex g_mutex;

    void my_log_call(const char *str) {{
        std::lock_guard<std::mutex> lock(g_mutex);

        if (!logfile) {{
            logfile = fopen("{orig_dll_name}-Proxy.log", "w");

            if (logfile == NULL)
                printf("[{orig_dll_name}-Proxy] failed to open log file !\\n");
            else
                setvbuf(logfile, NULL, _IONBF, 0);
        }}

        if (logfile != NULL)
            fprintf(logfile, "[{orig_dll_name}-Proxy] %s\\n", str);
        
        printf("[{orig_dll_name}-Proxy] %s\\n", str);
    }}
{func_defs}

    HINSTANCE orig_dll_instance;

    void InitializeFuncPtrs() {{
{func_ptr_inits}
    }}

    void EnsureSearchPath(HMODULE hModule) {{
        char dllPath[MAX_PATH];
        GetModuleFileNameA(hModule, dllPath, MAX_PATH);
        std::filesystem::path folder = std::filesystem::path(dllPath).parent_path();

        SetDllDirectoryA(folder.string().c_str());
    }}

    BOOL APIENTRY DllMain(HMODULE hModule, DWORD reason, LPVOID lpReserved) {{
        if (reason == DLL_PROCESS_ATTACH) {{
            EnsureSearchPath(hModule);

    #if 0
            AllocConsole();
            freopen_s((FILE**)stdout, "CONOUT$", "w", stdout);
    #endif

            char dllPath[MAX_PATH];
            GetModuleFileNameA(hModule, dllPath, MAX_PATH);

            std::filesystem::path p(dllPath);
            std::filesystem::path folder = p.parent_path();

            std::filesystem::path originalDllPath = folder / "{orig_dll_name}_o.dll";

            orig_dll_instance = LoadLibraryA(originalDllPath.string().c_str());

            if (orig_dll_instance == NULL) {{
                printf("[{orig_dll_name}-Proxy] Failed to load {orig_dll_name}_o.dll !\\n");
                return FALSE;
            }}
            else
                InitializeFuncPtrs();
        }}

        return TRUE;
    }}
}}
"""

func_ptr_init_template = """\
        orig_{real_func_name}_ptr = (void *)GetProcAddress(orig_dll_instance, "{real_func_name}");
        if (!orig_{real_func_name}_ptr)
            my_log_call("failed to find dll function '{real_func_name}' !");
"""

func_proxy_template = """
    void* orig_{real_func_name}_ptr = nullptr;
    const char* name_{real_func_name} = "calling '{real_func_name}'";
    __attribute__((naked)) __declspec(dllexport) void {real_func_name}(void) {{
        __asm (
            "push rax; push rcx; push rdx; push rbx;\\n"
            "push rbp; push rsi; push rdi;\\n"
            "push r8;  push r9;  push r10; push r11;\\n"
            "push r12; push r13; push r14; push r15;\\n"

            "pushfq;\\n"

            "sub rsp, 40;\\n"

            "mov rcx, [rip + name_{real_func_name}];\\n"
            "call my_log_call;\\n"

            "add rsp, 40;\\n"

            "popfq;\\n"

            "pop r15; pop r14; pop r13; pop r12;\\n"
            "pop r11; pop r10; pop r9;  pop r8;\\n"
            "pop rdi; pop rsi; pop rbp; pop rbx;\\n"
            "pop rdx; pop rcx; pop rax;\\n"

            "jmp qword ptr [rip + orig_{real_func_name}_ptr];\\n"
        );
    }}
"""

compile_str = "clang++ -m64 -static -shared -masm=intel -g -gcodeview -std=c++17 {src_name}.cpp -o {dll_name}.dll\n"

def get_dll_exports(dll_path):
    c_names = []
    try:
        pe = pefile.PE(dll_path)
        
        if not hasattr(pe, 'DIRECTORY_ENTRY_EXPORT'):
            print(f"No export table found in {dll_path}")
            return

        print(f"{'Ordinal':<10} {'Name':<80} {'Signature/Demangled'}")
        print("-" * 100)

        for exp in pe.DIRECTORY_ENTRY_EXPORT.symbols:
            name = exp.name.decode('utf-8') if exp.name else f"Ordinal_{exp.ordinal}"
            c_names.append(name)

            try:
                signature = demangle(name)
            except Exception:
                signature = "[C-Style / No Signature Available]"

            print(f"{exp.ordinal:<10} {name:<80} {signature}")

    except Exception as e:
        print(f"Error: {e}")
        return None

    return c_names

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_dll>")
        sys.exit(1)

    target_dll_path = sys.argv[1]
    c_names = get_dll_exports(target_dll_path)
    proper_name = Path(target_dll_path).stem

    directory = "dll-proxy-" + proper_name
    os.makedirs(directory, exist_ok=True)
    os.chdir(directory)

    func_defs = ""
    func_ptr_inits = ""

    for c_name in c_names:
        func_ptr_inits += func_ptr_init_template.format(real_func_name = c_name)
        func_defs += func_proxy_template.format(real_func_name = c_name)

    cpp_src = dll_proxy_template.format(orig_dll_name = proper_name, func_defs = func_defs, func_ptr_inits = func_ptr_inits)

    with open("dllmain.cpp", "w") as text_file:
        text_file.write(cpp_src)

    with open("compile.bat", "w") as text_file:
        text_file.write(compile_str.format(dll_name = proper_name, src_name = "dllmain"))