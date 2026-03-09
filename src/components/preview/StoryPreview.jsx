import { useMemo } from "react";
import PlayChoiceButton from "./PlayChoiceButton";
import { evaluateConditions } from "../../utils/storyLogic";

export default function StoryPreview({
  nodes,
  selectedNode,
  selectedNodeId,
  currentPlayNode,
  history,
  playVariables,
  previousPlayVariables,
  changedVariableKeys,
  startFromNode,
  resetToSelected,
  goToNode,
  goBack,
}) {
  const nodesById = useMemo(() => {
    const map = {};
    nodes.forEach((node) => {
      map[node.id] = node;
    });
    return map;
  }, [nodes]);

  const playNodeData = currentPlayNode?.data || null;
  const playChoices = playNodeData?.choices || [];
  const visibleChoices = playChoices.filter((choice) =>
    evaluateConditions(choice.conditions || [], playVariables || {})
  );

  return (
    <div className="preview-story">
      <div className="preview-header-row">
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Play Preview
        </h2>

        <div className="preview-toolbar">
          <button
            className="toolbar-button"
            onClick={() => startFromNode(selectedNodeId)}
            disabled={!selectedNodeId}
          >
            Start From Selected
          </button>

          <button
            className="toolbar-button"
            onClick={goBack}
            disabled={!history?.length}
          >
            Back
          </button>

          <button className="toolbar-button" onClick={resetToSelected}>
            Reset
          </button>
        </div>
      </div>

      <div className="preview-block">
        <h3 className="preview-title">Variables</h3>

        {Object.keys(playVariables || {}).length === 0 ? (
          <div className="muted">No variables defined.</div>
        ) : (
          <div className="variable-debugger-list">
            {Object.entries(playVariables).map(([key, value]) => {
              const changed = changedVariableKeys?.includes(key);
              const previousValue = previousPlayVariables?.[key];

              return (
                <div
                  key={key}
                  className={`variable-debugger-item ${
                    changed ? "changed" : ""
                  }`}
                >
                  <div className="variable-debugger-key">{key}</div>

                  <div className="variable-debugger-value">
                    {changed ? (
                      <>
                        <span className="variable-debugger-old">
                          {String(previousValue)}
                        </span>
                        <span className="variable-debugger-arrow">→</span>
                        <span className="variable-debugger-new">
                          {String(value)}
                        </span>
                      </>
                    ) : (
                      <span>{String(value)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!currentPlayNode ? (
        <div className="preview-block">
          <div className="muted">No story block available to play.</div>
        </div>
      ) : (
        <div className="preview-block">
          <h3 className="preview-title">
            {playNodeData?.title || "Untitled Block"}
          </h3>

          <div className="preview-content">
            {playNodeData?.content || "No content yet."}
          </div>

          <div className="helper-box" style={{ marginTop: 12 }}>
            Block type: {playNodeData?.blockType || "narrative"}
          </div>

          <div className="preview-choice-list">
            {visibleChoices.length === 0 ? (
              <div className="muted">No available choices.</div>
            ) : (
              visibleChoices.map((choice, index) => (
                <PlayChoiceButton
                  key={`${choice.targetNodeId}-${index}`}
                  choice={choice}
                  targetNode={nodesById[choice.targetNodeId]}
                  onChoose={() =>
                    goToNode(choice.targetNodeId, choice.effects || [])
                  }
                />
              ))
            )}
          </div>
        </div>
      )}

      <div className="helper-box">
        <strong>Editing:</strong>{" "}
        {selectedNode?.data?.title || "No block selected"}
        <br />
        <strong>Playing:</strong>{" "}
        {currentPlayNode?.data?.title || "Nothing"}
        <br />
        <strong>History:</strong> {history?.length || 0} step
        {(history?.length || 0) === 1 ? "" : "s"}
      </div>
    </div>
  );
}