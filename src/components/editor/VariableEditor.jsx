function detectType(value) {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  return "string";
}

function coerceValue(type, rawValue) {
  if (type === "boolean") return rawValue === "true" || rawValue === true;

  if (type === "number") {
    const n = Number(rawValue);
    return Number.isNaN(n) ? 0 : n;
  }

  return rawValue;
}

export default function VariableEditor({ variables = {}, setVariables }) {
  const entries = Object.entries(variables || {});

  function addVariable() {
    let name = "variable";
    let i = 1;

    while (variables[name + i]) i++;

    setVariables({
      ...variables,
      [name + i]: ""
    });
  }

  function removeVariable(key) {
    const next = { ...variables };
    delete next[key];
    setVariables(next);
  }

  function renameVariable(oldKey, newKey) {
    const trimmed = newKey.trim();

    if (!trimmed || trimmed === oldKey) return;
    if (variables[trimmed]) return;

    const next = {};

    for (const [k, v] of Object.entries(variables)) {
      if (k === oldKey) next[trimmed] = v;
      else next[k] = v;
    }

    setVariables(next);
  }

  function updateVariableValue(key, value) {
    setVariables({
      ...variables,
      [key]: value
    });
  }

  function changeVariableType(key, type) {
    const value = variables[key];

    let newValue = "";

    if (type === "boolean") newValue = Boolean(value);
    else if (type === "number") newValue = Number(value) || 0;
    else newValue = value?.toString() ?? "";

    setVariables({
      ...variables,
      [key]: newValue
    });
  }

  return (
    <div className="editor-section">

      <div className="editor-section-header">
        <h3>Variables</h3>

        <button
          className="toolbar-button"
          onClick={addVariable}
        >
          + Add Variable
        </button>
      </div>

      {entries.length === 0 && (
        <div className="helper-box">
          No variables yet.  
          Try creating <b>health</b>, <b>gold</b>, or <b>hasKey</b>.
        </div>
      )}

      <div className="choice-list">

        {entries.map(([key, value]) => {

          const type = detectType(value);

          return (
            <div key={key} className="choice-row">

              <div className="form-group">
                <label className="form-label">Name</label>

                <input
                  className="form-input"
                  defaultValue={key}
                  onBlur={(e) => renameVariable(key, e.target.value)}
                />
              </div>


              <div className="form-group">
                <label className="form-label">Type</label>

                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => changeVariableType(key, e.target.value)}
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                </select>
              </div>


              <div className="form-group">
                <label className="form-label">Value</label>

                {type === "boolean" ? (
                  <select
                    className="form-select"
                    value={String(value)}
                    onChange={(e) =>
                      updateVariableValue(
                        key,
                        coerceValue("boolean", e.target.value)
                      )
                    }
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                ) : (
                  <input
                    className="form-input"
                    type={type === "number" ? "number" : "text"}
                    value={value}
                    onChange={(e) =>
                      updateVariableValue(
                        key,
                        coerceValue(type, e.target.value)
                      )
                    }
                  />
                )}
              </div>

              <button
                className="danger-button"
                onClick={() => removeVariable(key)}
              >
                Delete Variable
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}