const exposedFunctions = {};
exposedFunctions.btoa = self.btoa.bind(self); // for pings

let babelParser, babelTraverse, sha256, parse5;

let doneInit = false;
async function initDeps() {
  ([ babelParser, babelTraverse, sha256, parse5 ] = await Promise.all([
    import('https://esm.sh/@babel/parser@7.26.5?bundle'),
    import('https://esm.sh/@babel/traverse@7.26.5?bundle').then(m => m.default),
    import('https://esm.sh/@noble/hashes@1.7.0/sha256?bundle').then(m => m.sha256),
    import('https://esm.sh/parse5@7.1.2?bundle'),
  ]));
  doneInit = true;
}

// Worker side code (worker.js)
self.onmessage = async (e) => {
  if (!doneInit) await initDeps();
  
  const { id, functionName, args } = e.data;
  try {
    if (typeof exposedFunctions[functionName] !== 'function') {
      throw new Error(`Function ${functionName} not found`);
    }
    const returnValue = await exposedFunctions[functionName](...args);
    self.postMessage({ id, returnValue });
  } catch (error) {
    console.log("Error in editorWorker.js:", {functionName, args, error});
    self.postMessage({ id, error: error.message });
  }
};


{
  let prevRootNodes = {};
  exposedFunctions.getNextOutputTemplateNodeForBugFinding = function({htmlString, alreadyConsumedNodeHashes, maxChars, minChars, docId}) {
    
    let prevRootNode = docId ? prevRootNodes[docId] : null;
    let rootNode = extractCodeTreeFromHtml({htmlString, prevRootNode});
    if(docId) prevRootNodes[docId] = rootNode;
    
    let node = findNextNodeToConsume({rootNode, alreadyConsumedNodeHashes, maxChars, minChars})
    if(!node) return null;
    return {
      code: node.code,
      hash: node.hash,
      absoluteStart: node.absoluteStart,
      absoluteEnd: node.absoluteEnd,
      comments: node.comments,
    };
  }
}

async function sha256Text(text) {
  const msgUint8 = new TextEncoder().encode(text);                          
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);          
  const hashArray = Array.from(new Uint8Array(hashBuffer));                    
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


exposedFunctions.getNextModelTextNodeForBugFinding = async function({docText, alreadyConsumedNodeHashes, maxChars}) {
  let nodes = docText.split(/(?=\n[^\s])/);
  let chunks = [""];
  while(nodes.length > 0) {
    if(chunks[chunks.length-1].length >= maxChars) chunks.push("");
    chunks[chunks.length-1] += nodes.shift();
  }

  let upToIndex = 0;
  let chunkObjs = [];
  for(let chunk of chunks) {
    upToIndex += chunk.length;
    chunkObjs.push({
      code: chunk,
      absoluteStart: upToIndex-chunk.length,
      absoluteEnd: upToIndex,
      hash: await sha256Text(chunk),
    });
  }
  
  let unsearchedChunkObjs = chunkObjs.filter(chunk => !alreadyConsumedNodeHashes.has(chunk.hash));
  if(unsearchedChunkObjs.length === 0) {
    return null;
  } else {
    return unsearchedChunkObjs[0];
  }
}

function adjustIndexToNearestTenthLine(index, fullDocStr, moveDir='up') {
  // Get all line start positions
  const lineStartPositions = [];
  let pos = 0;
  lineStartPositions.push(0);
  
  while (pos < fullDocStr.length) {
    pos = fullDocStr.indexOf('\n', pos);
    if (pos === -1) break;
    pos++; // Move past the newline
    lineStartPositions.push(pos);
  }
  
  // Find and adjust start position to nearest 10th line
  const currentLine = lineStartPositions.findIndex(pos => pos > index) - 1;
  const adjustedLine = Math[moveDir === 'up' ? 'floor' : 'ceil'](currentLine / 10) * 10;
  const adjustedIndex = lineStartPositions[adjustedLine] || (moveDir === 'up' ? 0 : fullDocStr.length);
  return adjustedIndex;
}

function findNextNodeToConsume({rootNode, alreadyConsumedNodeHashes, maxChars, minChars}) {
  // Store all valid nodes we find
  const candidates = [];
  
  /**
   * Recursively traverse the tree and collect valid nodes
   * @param {Object} node - Current node being processed
   */
  function traverse(node) {
    // Skip if this node has already been consumed
    if (alreadyConsumedNodeHashes.has(node.hash)) {
      return;
    }
    
    // If this node is within character limit, add it to candidates
    if (node.code.length <= maxChars && node.code.length >= minChars) {
      candidates.push(node);
    }
    
    // Traverse children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  // Start traversal from root
  traverse(rootNode);
  
  // If no candidates found, return null
  if (candidates.length === 0) {
      return null;
  }
  
  // Sort candidates by code length in descending order
  candidates.sort((a, b) => b.code.length - a.code.length);
  
  // Return the largest candidate
  return candidates[0];
}

{
  let prevRootNodes = {}; // speeds up extractCodeTreeFromHtml by 10x if we have prev tree
  let prevSuffixes = {}; // this is to help 're-use' the suffix if it's close enough, and hence get a longer prefix cache hit (for some models - depends on the prompt template)
  exposedFunctions.getPrefixAndSuffixForAutocomplete = function({fullDocStr, caretPosition, characterLimit=20000, docId}={}) { // if doc is too big, this gets a subrange around the cursor
    let startTime = performance.now();
    let range;
    try {
      let prevRootNode = docId ? prevRootNodes[docId] : null;
      let rootNode = extractCodeTreeFromHtml({htmlString:fullDocStr, prevRootNode});
      if(docId) prevRootNodes[docId] = rootNode;
      range = findCodeRangeAroundCursor(rootNode, caretPosition, characterLimit);
    } catch(e) {
      console.debug("Syntax error preventing smart context:", e);
    }

    // NOTE: Some models use a bad prompt template that makes it ~impossible to do prefix caching properly, but we apply these fixes either way.
    // Adjust start

    if(!range) { // handle case where there was a syntax error above
      const halfLimit = Math.floor(characterLimit / 2);
      const start = Math.max(0, caretPosition - halfLimit);
      const end = Math.min(fullDocStr.length, start + characterLimit);
      range = { start, end };
      range.start = adjustIndexToNearestTenthLine(range.start, fullDocStr, 'up'); 
      range.end = adjustIndexToNearestTenthLine(range.end, fullDocStr, 'down'); 
    } else {
      range.start = adjustIndexToNearestTenthLine(range.start, fullDocStr, 'up');
    }
    
    let prefix = fullDocStr.slice(range.start, caretPosition);
    let suffix = fullDocStr.slice(caretPosition, range.end);
    
    // Re-use previous suffix they closely match:
    let mostOfSuffix = suffix.slice(0, Math.floor(suffix.length*0.9));
    if(docId && prevSuffixes[docId] && prevSuffixes[docId].startsWith(mostOfSuffix)) {
      suffix = prevSuffixes[docId];
      console.debug("Copilot: Using same suffix");
    } else {
      console.debug("Copilot: Using different suffix");
    }
    prevSuffixes[docId] = suffix;
    
    console.debug("Copilot gather-context compute time:", performance.now()-startTime);
    return { prefix, suffix };
  }
}

function extractCodeTreeFromHtml({htmlString, prevRootNode = null}={}) {
  // Create a cache of previous nodes by their hash
  const nodeCache = new Map();
  if (prevRootNode) {
    function cacheNodesRecursive(node) {
      nodeCache.set(node.hash, node);
      for (const child of node.children) {
        cacheNodesRecursive(child);
      }
    }
    cacheNodesRecursive(prevRootNode);
  }

  // Helper function to find script elements with their locations
  function findScriptElements(node, scripts = []) {
    if (node.nodeName === 'script') {
      scripts.push(node);
    }
    if (node.childNodes) {
      for (const child of node.childNodes) {
        findScriptElements(child, scripts);
      }
    }
    return scripts;
  }

  function computeSha256(text) {
    const data = new TextEncoder().encode(text);
    const hash = sha256(data);
    return Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Try to reuse the entire document if nothing has changed
  const docHash = computeSha256(htmlString);
  if (prevRootNode && prevRootNode.hash === docHash) {
    return prevRootNode;
  }

  // Parse HTML using parse5
  const document = parse5.parse(htmlString, { sourceCodeLocationInfo: true });
  const scriptElements = findScriptElements(document);

  function findEnclosingFunctionOrClassOrObject(path) {
    return path.findParent(parentPath => 
      parentPath.isFunctionDeclaration() ||
      parentPath.isFunctionExpression() ||
      parentPath.isArrowFunctionExpression() ||
      parentPath.isClassDeclaration() ||
      parentPath.isClassExpression() ||
      (parentPath.isObjectExpression() && 
        (parentPath.parentPath.isVariableDeclarator() || 
        parentPath.parentPath.isAssignmentExpression()))
    );
  }

  function getNodeType(path) {
    const node = path.node;
    const type = {
      base: path.isClassDeclaration() || path.isClassExpression() ? 'class' :
            path.isObjectExpression() ? 'object' :
            path.isArrowFunctionExpression() ? 'arrow' :
            path.isFunctionDeclaration() ? 'function-declaration' :
            'function-expression',
      
      isAsync: node.async || false,
      isGenerator: node.generator || false,
      declarationType: null
    };
    
    const parentPath = path.parentPath;
    const parentNode = parentPath?.node;
    
    if (parentNode) {
      if (parentNode.type === 'VariableDeclarator') {
        type.declarationType = parentPath.parentPath?.node.kind || 'var';
      } else if (parentNode.type === 'AssignmentExpression') {
        type.declarationType = 'assignment';
      } else if (parentNode.type === 'Property' || parentNode.type === 'ObjectProperty') {
        type.declarationType = 'object-property';
      } else if (parentNode.type === 'ClassMethod' || parentNode.type === 'ObjectMethod') {
        type.declarationType = 'method';
      }
    }
    return type;
  }

  function extractComments(path) {
    const comments = [];
    const leadingComments = path.node.leadingComments || [];
    for (const comment of leadingComments) {
      comments.push({
        type: comment.type,
        value: comment.value.trim(),
        start: comment.start,
        end: comment.end
      });
    }
    return comments;
  }

  function getSnippetRange(path) {
    let relevantPath = path;
    const parentPath = path.parentPath;
    const parentNode = parentPath && parentPath.node;
    const node = path.node;
    
    // Check if this is an IIFE
    const isIIFE = parentNode && (
      parentNode.type === 'CallExpression' && 
      (node.type === 'FunctionExpression' || 
       node.type === 'ArrowFunctionExpression' ||
       node.type === 'FunctionDeclaration')
    );
    
    if (isIIFE) {
      // For IIFEs, include the entire call expression including outer parentheses
      relevantPath = parentPath;
    } else if (
      parentNode && (
        (parentNode.type === 'VariableDeclarator' && parentNode.init === node) ||
        (parentNode.type === 'AssignmentExpression' && parentNode.right === node)
      )
    ) {
      if (path.isObjectExpression()) {
        relevantPath = parentPath.parentPath;
      } else {
        relevantPath = parentPath;
      }
    }
    
    return {
      snippetStart: relevantPath.node.start,
      snippetEnd: relevantPath.node.end
    };
  }

  function buildNodeData(path, fullCode, scriptStartLine, scriptStartOffset) {
    const { snippetStart, snippetEnd } = getSnippetRange(path);
    const snippet = fullCode.slice(snippetStart, snippetEnd);
    const hash = computeSha256(snippet);
    
    // Check if we can reuse a cached node
    const cachedNode = nodeCache.get(hash);
    if (cachedNode) {
      return {
        ...cachedNode,
        children: [] // Clear children as they'll be reconstructed
      };
    }

    const node = path.node;
    const lineNumber = (node.loc?.start?.line || 0) + scriptStartLine - 1;
    const absoluteStart = snippetStart + scriptStartOffset;
    const absoluteEnd = snippetEnd + scriptStartOffset;
    
    return {
      code: snippet,
      hash,
      lineNumber,
      absoluteStart,
      absoluteEnd,
      type: getNodeType(path),
      comments: extractComments(path),
      children: []
    };
  }

  function extractFunctionNodesFromScript(scriptCode, isModule, scriptStartLine, scriptStartOffset) {
    // Check if we can reuse the entire script's nodes
    const scriptHash = computeSha256(scriptCode);
    const cachedScript = nodeCache.get(scriptHash);
    if (cachedScript) {
      return cachedScript.children.map(child => ({
        ...child,
        children: [] // Clear children as they'll be reconstructed
      }));
    }

    const ast = babelParser.parse(scriptCode, {
      sourceType: isModule ? 'module' : 'script',
      plugins: [],
      errorRecovery: true,
    });
    
    const scriptNodes = [];
    babelTraverse(ast, {
      enter(path) {
        if (
          path.isFunctionDeclaration() ||
          path.isFunctionExpression() ||
          path.isArrowFunctionExpression() ||
          path.isClassDeclaration() ||
          path.isClassExpression() ||
          (path.isObjectExpression() && 
            (path.parentPath.isVariableDeclarator() || 
            path.parentPath.isAssignmentExpression()))
        ) {
          const parentPath = findEnclosingFunctionOrClassOrObject(path);
          const parentId = parentPath ? parentPath.node._nodeId : null;
          
          if (path.node._nodeId == null) {
            path.node._nodeId = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
          }
          
          const nodeId = path.node._nodeId;
          scriptNodes.push({
            path,
            nodeId,
            parentId
          });
        }
      }
    });

    const nodeDataList = [];
    for (const item of scriptNodes) {
      const data = buildNodeData(item.path, scriptCode, scriptStartLine, scriptStartOffset);
      nodeDataList.push({
        id: item.nodeId,
        parentId: item.parentId,
        ...data
      });
    }
    
    return nodeDataList;
  }

  let allNodes = [];
  
  for (const scriptEl of scriptElements) {
    const scriptCode = scriptEl.childNodes
      ?.find(node => node.nodeName === '#text')
      ?.value || '';
    
    const scriptStartLine = scriptEl.sourceCodeLocation?.startTag?.endLine || 1;
    const scriptStartOffset = scriptEl.sourceCodeLocation?.startTag?.endOffset || 0;
    const scriptEndOffset = scriptEl.sourceCodeLocation?.endTag?.startOffset || 0;
    const isModule = scriptEl.attrs?.some(attr => 
      attr.name === 'type' && attr.value.toLowerCase() === 'module'
    );
    
    const nodesFromThisScript = extractFunctionNodesFromScript(
      scriptCode,
      isModule,
      scriptStartLine,
      scriptStartOffset
    );
    
    const scriptHash = computeSha256(scriptCode);
    let scriptNode = nodeCache.get(scriptHash) || {
      id: Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9),
      type: { base: "script", isModule },
      code: scriptCode,
      hash: scriptHash,
      absoluteStart: scriptStartOffset,
      absoluteEnd: scriptEndOffset,
      children: [],
    };

    allNodes.push(...nodesFromThisScript);
    allNodes.push(scriptNode);
    
    for (let node of nodesFromThisScript) {
      if (!node.parentId) node.parentId = scriptNode.id;
    }
  }

  const nodeById = {};
  for (const n of allNodes) {
    nodeById[n.id] = n;
  }
  for (const n of allNodes) {
    if (n.parentId && nodeById[n.parentId]) {
      nodeById[n.parentId].children.push(n);
    }
  }
  
  const topLevelNodes = allNodes.filter(n => !n.parentId);
  let docNodeId = Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
  topLevelNodes.forEach(n => n.parentId = docNodeId);
  
  let docNode = {
    id: docNodeId,
    type: { base: "document" },
    code: htmlString,
    hash: docHash,
    absoluteStart: 0,
    absoluteEnd: htmlString.length,
    children: topLevelNodes,
  };

  function giveParentReferenceToChildrenRecursive(node, parent) {
    node.parent = parent;
    for (let child of node.children) {
      giveParentReferenceToChildrenRecursive(child, node);
    }
  }
  giveParentReferenceToChildrenRecursive(docNode, null);
  
  return docNode;
}



function findCodeRangeAroundCursor(rootNode, cursorPosition, characterLimit) {
  // Helper function to find the deepest node containing the cursor
  function findDeepestNode(node, cursor) {
    if (node.absoluteStart <= cursor && node.absoluteEnd >= cursor) {
      for (const child of node.children || []) {
        const deepestChild = findDeepestNode(child, cursor);
        if (deepestChild) return deepestChild;
      }
      return node;
    }
    return null;
  }

  // Helper function to trim a range to fit within the limit
  function trimRange(start, end, cursor, limit) {
    if (end - start <= limit) return { start, end };
    
    // Always keep the cursor position in the middle of the range
    const halfLimit = Math.floor(limit / 2);
    return {
      start: Math.max(cursor - halfLimit, start),
      end: Math.min(cursor + (limit - halfLimit), end)
    };
  }

  // Helper function to expand the range by consuming siblings
  function expandRange(node, rangeStart, rangeEnd) {
    let currentStart = rangeStart;
    let currentEnd = rangeEnd;
    
    // Try to expand to the left (previous siblings)
    let sibling = node;
    while (sibling) {
      const prevSibling = getPreviousSibling(sibling);
      if (!prevSibling) break;
      currentStart = prevSibling.absoluteStart;
      sibling = prevSibling;
    }
    
    // Try to expand to the right (next siblings)
    sibling = node;
    while (sibling) {
      const nextSibling = getNextSibling(sibling);
      if (!nextSibling) break;
      currentEnd = nextSibling.absoluteEnd;
      sibling = nextSibling;
    }
    
    return { start: currentStart, end: currentEnd };
  }

  // Helper functions to get siblings
  function getPreviousSibling(node) {
    if (!node.parent) return null;
    const siblings = node.parent.children;
    const index = siblings.indexOf(node);
    return index > 0 ? siblings[index - 1] : null;
  }

  function getNextSibling(node) {
    if (!node.parent) return null;
    const siblings = node.parent.children;
    const index = siblings.indexOf(node);
    return index < siblings.length - 1 ? siblings[index + 1] : null;
  }

  // Find the deepest node containing the cursor
  const deepestNode = findDeepestNode(rootNode, cursorPosition);
  if (!deepestNode) {
    throw new Error("Cursor is not within any node.");
  }

  // Initialize with the deepest node's full range, then trim if needed
  let rangeStart = deepestNode.absoluteStart;
  let rangeEnd = deepestNode.absoluteEnd;
  const initialTrimmed = trimRange(rangeStart, rangeEnd, cursorPosition, characterLimit);
  rangeStart = initialTrimmed.start;
  rangeEnd = initialTrimmed.end;

  // Expand the range by consuming all siblings, then trim back
  let expandedRange = expandRange(deepestNode, rangeStart, rangeEnd);
  const siblingsTrimmed = trimRange(
    expandedRange.start,
    expandedRange.end,
    cursorPosition,
    characterLimit
  );
  rangeStart = siblingsTrimmed.start;
  rangeEnd = siblingsTrimmed.end;

  // Move up the hierarchy and expand the range further
  let currentNode = deepestNode;
  while (currentNode.parent) {
    const parent = currentNode.parent;
    
    // First expand to the parent's full range
    const parentRange = {
      start: Math.min(parent.absoluteStart, rangeStart),
      end: Math.max(parent.absoluteEnd, rangeEnd)
    };
    
    // Then expand to include all siblings at this level
    expandedRange = expandRange(parent, parentRange.start, parentRange.end);
    
    // Trim the expanded range to fit the limit
    const trimmedRange = trimRange(
      expandedRange.start,
      expandedRange.end,
      cursorPosition,
      characterLimit
    );
    
    // If trimming didn't change anything, we can't expand further
    if (trimmedRange.start === rangeStart && trimmedRange.end === rangeEnd) {
      break;
    }
    
    rangeStart = trimmedRange.start;
    rangeEnd = trimmedRange.end;
    currentNode = parent;
  }

  // Find all nodes at the highest level that are fully included in the range
  let highestNodes = [];
  let candidateNode = currentNode;
  while (candidateNode.parent && 
         candidateNode.parent.absoluteStart >= rangeStart && 
         candidateNode.parent.absoluteEnd <= rangeEnd) {
    candidateNode = candidateNode.parent;
  }

  // Get all siblings at this level that are fully included
  if (candidateNode.parent) {
    const siblings = candidateNode.parent.children;
    for (const sibling of siblings) {
      if (sibling.absoluteStart >= rangeStart && sibling.absoluteEnd <= rangeEnd) {
        highestNodes.push(sibling);
      }
    }
  } else {
    highestNodes.push(candidateNode);
  }

  // Sort by start position and take the earliest one
  highestNodes.sort((a, b) => a.absoluteStart - b.absoluteStart);
  const highestNode = highestNodes[0];

  return {
    start: rangeStart,
    end: rangeEnd,
    highestNode,
  };
}