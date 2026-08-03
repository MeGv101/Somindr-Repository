import { translateText } from "./translator";

const originalTextMap = new WeakMap<Text, string>();
let currentLang = "es";
let observer: MutationObserver | null = null;

function shouldSkip(node: Node): boolean {
  const parentTag = node.parentElement?.tagName;
  return parentTag === "SCRIPT" || parentTag === "STYLE" || parentTag === "NOSCRIPT";
}

function getAllTextNodes(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

async function translateNode(node: Text, targetLang: string) {
  if (shouldSkip(node)) return;


  const original = originalTextMap.get(node) ?? node.textContent?.trim() ?? "";
  if (!original) return;
  originalTextMap.set(node, original);

  if (targetLang === "es") {
    node.textContent = original;
    return;
  }

  node.textContent = await translateText(original, targetLang);
}


export async function setLanguage(targetLang: string) {
  currentLang = targetLang;
  const nodes = getAllTextNodes(document.body);
  await Promise.all(nodes.map((n) => translateNode(n, targetLang)));
}


export function startAutoTranslateObserver() {
  if (observer) return; 

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((added) => {
        if (added.nodeType === Node.TEXT_NODE) {
          translateNode(added as Text, currentLang);
        } else if (added.nodeType === Node.ELEMENT_NODE) {
          getAllTextNodes(added).forEach((n) => translateNode(n, currentLang));
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}