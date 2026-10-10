// Supabase connection for the notes board.
// Both values are safe to publish: the key is the project's public (anon / publishable)
// key, and notes can only be read or written through functions that check the password.
// Find them in Supabase under Project Settings -> API.
window.NOTES_CONFIG = {
  supabaseUrl: "",
  supabaseKey: "",
};
