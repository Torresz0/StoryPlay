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

const nodeTypes = {
  storyNode: StoryNode,
};

function StoryCanvasInner({
  nodes,
  edges,
  onNodesChange,
  setSelectedNodeId,
  addNode,
  connectNodesFromHandle,
}) {
  const { screenToFlowPosition } = useReactFlow();

  const styledEdges = edges.map((edge) => ({
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

      <ReactFlow
        nodes={nodes}
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