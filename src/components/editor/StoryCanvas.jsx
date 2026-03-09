import { useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import StoryNode from "./StoryNode";
import NodeSearchBar from "./NodeSearchBar";
import { analyzeStoryGraph, groupIssuesByNode } from "../../utils/graphHealth";

const nodeTypes = {
  storyNode: StoryNode,
};

function StoryCanvasInner({
  nodes,
  edges,
  variables,
  selectedNodeId,
  onNodesChange,
  setSelectedNodeId,
  addNode,
  addChoiceToNode,
  connectNodesFromHandle,
  currentPlayNodeId,
}) {
  const { screenToFlowPosition, setCenter, getNode } = useReactFlow();

  const styledEdges = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      style: {
        strokeWidth: 2,
      },
      labelStyle: {
        fill: "#e5e7eb",
        fontWeight: 600,
      },
    }));
  }, [edges]);

  const nodeIssueMap = useMemo(() => {
    const issues = analyzeStoryGraph(nodes, variables);
    return groupIssuesByNode(issues);
  }, [nodes, variables]);

  function centerOnNode(nodeId) {
    const node = getNode(nodeId);
    if (!node) return;

    const width = node.width ?? 220;
    const height = node.height ?? 120;

    const centerX = node.position.x + width / 2;
    const centerY = node.position.y + height / 2;

    setCenter(centerX, centerY, {
      zoom: 1.2,
      duration: 300,
    });
  }

  useEffect(() => {
    if (selectedNodeId) {
      centerOnNode(selectedNodeId);
    }
  }, [selectedNodeId]);

  function jumpToNode(nodeId) {
    setSelectedNodeId(nodeId);
    centerOnNode(nodeId);
  }

  const canvasNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onSelectNode: setSelectedNodeId,
        onAddChoice: addChoiceToNode,
        onCenterNode: centerOnNode,
        graphIssues: nodeIssueMap[node.id] || [],
      },
      className: node.id === currentPlayNodeId ? "playing-node" : "",
    }));
  }, [
    nodes,
    setSelectedNodeId,
    addChoiceToNode,
    currentPlayNodeId,
    nodeIssueMap,
  ]);

  function handlePaneDoubleClick(event) {
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(position);
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div className="canvas-toolbar">
        <button className="toolbar-button" onClick={() => addNode()}>
          + Add Block
        </button>
      </div>

      <div className="canvas-searchbar-wrap">
        <NodeSearchBar nodes={nodes} onJumpToNode={jumpToNode} />
      </div>

      <ReactFlow
        nodes={canvasNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        onPaneDoubleClick={handlePaneDoubleClick}
        onConnect={connectNodesFromHandle}
        fitView
      >
        <MiniMap zoomable pannable />
        <Background gap={24} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default function StoryCanvas(props) {
  return (
    <ReactFlowProvider>
      <StoryCanvasInner {...props} />
    </ReactFlowProvider>
  );
}