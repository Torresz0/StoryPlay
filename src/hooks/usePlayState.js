import { useEffect, useMemo, useState } from "react";
import { applyEffects } from "../utils/storyLogic";

export default function usePlayState(nodes, selectedNodeId, initialVariables = {}) {
  const [currentPlayNodeId, setCurrentPlayNodeId] = useState(
    selectedNodeId || nodes[0]?.id || null
  );
  const [history, setHistory] = useState([]);
  const [playVariables, setPlayVariables] = useState(initialVariables || {});

  useEffect(() => {
    if (!nodes.length) {
      setCurrentPlayNodeId(null);
      setHistory([]);
      setPlayVariables(initialVariables || {});
      return;
    }

    const playNodeStillExists = nodes.some(
      (node) => node.id === currentPlayNodeId
    );

    if (!playNodeStillExists) {
      setCurrentPlayNodeId(selectedNodeId || nodes[0]?.id || null);
      setHistory([]);
      setPlayVariables(initialVariables || {});
      return;
    }

    setHistory((prevHistory) =>
      prevHistory.filter((id) => nodes.some((node) => node.id === id))
    );
  }, [nodes, currentPlayNodeId, selectedNodeId, initialVariables]);

  const currentPlayNode = useMemo(() => {
    return nodes.find((node) => node.id === currentPlayNodeId) || null;
  }, [nodes, currentPlayNodeId]);

  function startFromNode(nodeId) {
    if (!nodeId) return;
    setCurrentPlayNodeId(nodeId);
    setHistory([]);
    setPlayVariables(initialVariables || {});
  }

  function resetToSelected() {
    setCurrentPlayNodeId(selectedNodeId || nodes[0]?.id || null);
    setHistory([]);
    setPlayVariables(initialVariables || {});
  }

  function goToNode(nodeId, effects = []) {
    if (!nodeId || nodeId === currentPlayNodeId) return;

    setHistory((prev) => {
      if (!currentPlayNodeId) return prev;
      return [...prev, currentPlayNodeId];
    });

    setPlayVariables((prev) => applyEffects(effects || [], prev || {}));
    setCurrentPlayNodeId(nodeId);
  }

  function goBack() {
    setHistory((prev) => {
      if (!prev.length) return prev;

      const nextHistory = [...prev];
      const previousNodeId = nextHistory.pop();

      setCurrentPlayNodeId(previousNodeId || null);
      return nextHistory;
    });
  }

  return {
    currentPlayNodeId,
    currentPlayNode,
    history,
    playVariables,
    startFromNode,
    resetToSelected,
    goToNode,
    goBack,
  };
}