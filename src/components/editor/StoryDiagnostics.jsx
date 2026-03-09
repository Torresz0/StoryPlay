import { useMemo } from "react";
import { analyzeStoryGraph } from "../../utils/graphHealth";

export default function StoryDiagnostics({
  nodes,
  variables,
  onJumpToNode,
}) {
  const issues = useMemo(() => {
    return analyzeStoryGraph(nodes, variables);
  }, [nodes, variables]);

  return (
    <div className="editor-section">
      <div className="editor-section-header">
        <h3 className="section-title">Story Diagnostics</h3>
      </div>

      <div className="diagnostics-list">
        {issues.map((issue, index) => {
          const isClickable = Boolean(issue.nodeId && onJumpToNode);

          return (
            <button
              key={`${issue.message}-${index}`}
              type="button"
              className={`diagnostic-item diagnostic-${issue.severity} ${
                isClickable ? "diagnostic-clickable" : ""
              }`}
              onClick={() => {
                if (issue.nodeId && onJumpToNode) {
                  onJumpToNode(issue.nodeId);
                }
              }}
              disabled={!isClickable}
            >
              <div className="diagnostic-badge">
                {issue.severity === "error"
                  ? "Error"
                  : issue.severity === "warning"
                  ? "Warning"
                  : "OK"}
              </div>
              <div className="diagnostic-message">{issue.message}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}