import { useMemo, useState } from "react";
import { useNodesState } from "reactflow";
import sampleStory from "../data/sampleStory";
import { buildEdgesFromNodes } from "../utils/edgeHelpers";
import { createNewChoice, createNewNode } from "../utils/nodeHelpers";

export default function useStoryState() {
  const [nodes, setNodes, onNodesChange] = useNodesState(sampleStory.nodes);
  const [variables, setVariables] = useState(sampleStory.variables || {});
  const [selectedNodeId, setSelectedNodeId] = useState(
    sampleStory.nodes[0]?.id ?? null
  );

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const edges = useMemo(() => buildEdgesFromNodes(nodes), [nodes]);

  function addNode(position = null) {
    const newNode = createNewNode(nodes.length);

    const nodeWithPosition = position
      ? {
          ...newNode,
          position,
        }
      : newNode;

    setNodes((nds) => [...nds, nodeWithPosition]);
    setSelectedNodeId(nodeWithPosition.id);
  }

  function updateSelectedNodeField(field, value) {
    if (!selectedNodeId) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
              },
            }
          : node
      )
    );
  }

  function deleteSelectedNode() {
    if (!selectedNodeId) return;

    const deletingId = selectedNodeId;

    setNodes((nds) => {
      const remainingNodes = nds.filter((node) => node.id !== deletingId);

      return remainingNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          choices: (node.data?.choices || []).filter(
            (choice) => choice.targetNodeId !== deletingId
          ),
        },
      }));
    });

    setSelectedNodeId(null);
  }

  function addChoiceToSelectedNode() {
    if (!selectedNodeId) return;

    const newChoice = createNewChoice();

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                choices: [
                  ...(node.data?.choices || []),
                  {
                    ...newChoice,
                    conditions: [],
                    effects: [],
                  },
                ],
              },
            }
          : node
      )
    );
  }

  function addChoiceToNode(nodeId) {
    if (!nodeId) return;

    const newChoice = createNewChoice();

    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                choices: [
                  ...(node.data?.choices || []),
                  {
                    ...newChoice,
                    conditions: [],
                    effects: [],
                  },
                ],
              },
            }
          : node
      )
    );

    setSelectedNodeId(nodeId);
  }

  function updateChoiceOnSelectedNode(choiceId, field, value) {
    if (!selectedNodeId) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                choices: (node.data?.choices || []).map((choice) =>
                  choice.id === choiceId
                    ? {
                        ...choice,
                        [field]: value,
                      }
                    : choice
                ),
              },
            }
          : node
      )
    );
  }

  function removeChoiceFromSelectedNode(choiceId) {
    if (!selectedNodeId) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                choices: (node.data?.choices || []).filter(
                  (choice) => choice.id !== choiceId
                ),
              },
            }
          : node
      )
    );
  }

  function connectNodesFromHandle(connection) {
    const { source, target } = connection;

    if (!source || !target || source === target) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== source) return node;

        const existingChoices = node.data?.choices || [];
        const alreadyExists = existingChoices.some(
          (choice) => choice.targetNodeId === target
        );

        if (alreadyExists) return node;

        return {
          ...node,
          data: {
            ...node.data,
            choices: [
              ...existingChoices,
              {
                id: crypto.randomUUID(),
                label: "New choice",
                targetNodeId: target,
                conditions: [],
                effects: [],
              },
            ],
          },
        };
      })
    );
  }

  return {
    nodes,
    variables,
    setVariables,
    edges,
    selectedNode,
    selectedNodeId,
    setNodes,
    onNodesChange,
    setSelectedNodeId,
    addNode,
    updateSelectedNodeField,
    deleteSelectedNode,
    addChoiceToSelectedNode,
    addChoiceToNode,
    updateChoiceOnSelectedNode,
    removeChoiceFromSelectedNode,
    connectNodesFromHandle,
  };
}