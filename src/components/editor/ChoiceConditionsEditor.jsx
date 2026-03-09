const OPERATORS = [
  { value: "equals", label: "==" },
  { value: "notEquals", label: "!=" },
  { value: "greaterThan", label: ">" },
  { value: "lessThan", label: "<" },
  { value: "greaterThanOrEqual", label: ">=" },
  { value: "lessThanOrEqual", label: "<=" },
];

function getDefaultCondition(variables) {
  const firstVariable = Object.keys(variables || {})[0] || "";

  return {
    variable: firstVariable,
    operator: "equals",
    value: firstVariable ? variables[firstVariable] : "",
  };
}

export default function ChoiceConditionsEditor({
  choice,
  variables = {},
  onUpdate,
}) {
  const variableKeys = Object.keys(variables || {});
  const conditions = choice.conditions || [];

  function addCondition() {
    onUpdate("conditions", [...conditions, getDefaultCondition(variables)]);
  }

  function updateCondition(index, field, value) {
    const next = [...conditions];
    const current = next[index] || {};

    next[index] = {
      ...current,
      [field]: value,
    };

    if (field === "variable") {
      const nextVariableValue = variables[value];
      if (nextVariableValue !== undefined) {
        next[index].value = nextVariableValue;
      }
    }

    onUpdate("conditions", next);
  }

  function removeCondition(index) {
    const next = [...conditions];
    next.splice(index, 1);
    onUpdate("conditions", next);
  }

  function renderValueInput(condition, index) {
    const selectedVariable = condition.variable;
    const selectedValue = variables[selectedVariable];
    const selectedType = typeof selectedValue;

    if (selectedType === "boolean") {
      return (
        <select
          className="form-select"
          value={String(condition.value)}
          onChange={(e) =>
            updateCondition(index, "value", e.target.value === "true")
          }
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );
    }

    return (
      <input
        className="form-input"
        type={selectedType === "number" ? "number" : "text"}
        value={condition.value ?? ""}
        onChange={(e) =>
          updateCondition(
            index,
            "value",
            selectedType === "number" ? Number(e.target.value) : e.target.value
          )
        }
      />
    );
  }

  return (
    <div className="editor-section">
      <div className="editor-section-header">
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          Conditions
        </h3>

        <button
          type="button"
          className="toolbar-button"
          onClick={addCondition}
          disabled={variableKeys.length === 0}
        >
          + Add Condition
        </button>
      </div>

      {variableKeys.length === 0 ? (
        <div className="helper-box">
          Add at least one variable first to create conditions.
        </div>
      ) : conditions.length === 0 ? (
        <div className="helper-box">No conditions on this choice yet.</div>
      ) : (
        <div className="choice-list">
          {conditions.map((condition, index) => (
            <div key={index} className="choice-row">
              <div className="form-group">
                <label className="form-label">Variable</label>
                <select
                  className="form-select"
                  value={condition.variable || ""}
                  onChange={(e) =>
                    updateCondition(index, "variable", e.target.value)
                  }
                >
                  {variableKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Operator</label>
                <select
                  className="form-select"
                  value={condition.operator || "equals"}
                  onChange={(e) =>
                    updateCondition(index, "operator", e.target.value)
                  }
                >
                  {OPERATORS.map((operator) => (
                    <option key={operator.value} value={operator.value}>
                      {operator.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Value</label>
                {renderValueInput(condition, index)}
              </div>

              <button
                type="button"
                className="danger-button"
                onClick={() => removeCondition(index)}
              >
                Remove Condition
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}