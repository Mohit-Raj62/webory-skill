import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

export interface ExecutionStep {
  line: number;
  variables: Record<string, any>;
  callStack: string[];
  nodeType: string;
  memory: any[];
  error?: string;
  errorLine?: number;
}

export class VizEngine {
  private steps: ExecutionStep[] = [];
  private code: string;
  private language: string;
  private maxSteps = 1000;

  constructor(code: string, language: string) {
    this.code = code;
    this.language = language;
    this.processCode();
  }

  private processCode() {
    if (this.language === "javascript") {
      this.processJsCode();
    } else {
      this.processSimulatedCode();
    }
  }

  private processJsCode() {
    try {
      const ast = parser.parse(this.code, {
        sourceType: "unambiguous",
        plugins: ["typescript"],
      });

      const scopes: Record<string, any>[] = [{}];
      const callStack: string[] = ["global"];
      const stepLimit = this.maxSteps;
      let currentStepCount = 0;

      const interpreter = {
        evaluate: (node: any, scope: any): any => {
          if (!node) return undefined;
          
          switch (node.type) {
            case "NumericLiteral": return node.value;
            case "StringLiteral": return node.value;
            case "BooleanLiteral": return node.value;
            case "Identifier": return scope[node.name];
            case "BinaryExpression": {
              const left = interpreter.evaluate(node.left, scope);
              const right = interpreter.evaluate(node.right, scope);
              switch (node.operator) {
                case "+": return left + right;
                case "-": return left - right;
                case "*": return left * right;
                case "/": return left / right;
                case "<": return left < right;
                case ">": return left > right;
                case "<=": return left <= right;
                case ">=": return left >= right;
                case "==": return left == right;
                case "===": return left === right;
                default: return undefined;
              }
            }
            case "ArrayExpression": {
              return node.elements.map((el: any) => interpreter.evaluate(el, scope));
            }
            case "MemberExpression": {
              const obj = interpreter.evaluate(node.object, scope);
              const prop = node.computed ? interpreter.evaluate(node.property, scope) : node.property.name;
              return obj?.[prop];
            }
            default: return undefined;
          }
        }
      };

      // For this pro version, we record steps during a simplified traversal
      // We'll simulate execution by visiting nodes and updating a virtual scope
      const virtualScope: Record<string, any> = {};
      
      traverse(ast as any, {
        enter: (path) => {
          if (currentStepCount >= stepLimit) return;

          const node = path.node;
          const loc = node.loc;

          if (loc && (node.type.includes("Statement") || node.type === "VariableDeclaration")) {
            try {
              // Handle Variable Declarations
              if (node.type === "VariableDeclaration") {
                node.declarations.forEach(decl => {
                  if (decl.id.type === "Identifier") {
                    const val = interpreter.evaluate(decl.init, virtualScope);
                    virtualScope[decl.id.name] = val;
                  }
                });
              }

              // Handle Assignments
              if (node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression") {
                const expr = node.expression;
                if (expr.left.type === "Identifier") {
                  const val = interpreter.evaluate(expr.right, virtualScope);
                  virtualScope[expr.left.name] = val;
                } else if (expr.left.type === "MemberExpression") {
                  const obj = interpreter.evaluate(expr.left.object, virtualScope);
                  const prop = expr.left.computed ? interpreter.evaluate(expr.left.property, virtualScope) : (expr.left.property as any).name;
                  if (obj === undefined || obj === null) {
                    throw new Error(`Cannot set property '${prop}' of ${obj}`);
                  }
                  obj[prop] = interpreter.evaluate(expr.right, virtualScope);
                }
              }

              this.steps.push({
                line: loc.start.line,
                variables: JSON.parse(JSON.stringify(virtualScope)),
                callStack: [...callStack],
                nodeType: node.type,
                memory: []
              });
              currentStepCount++;
            } catch (err: any) {
              // Record runtime error as a step
              this.steps.push({
                line: loc.start.line,
                variables: JSON.parse(JSON.stringify(virtualScope)),
                callStack: [...callStack],
                nodeType: "Error",
                memory: [],
                error: err.message,
                errorLine: loc.start.line
              });
              throw err; // Stop traversal
            }
          }
        }
      });

    } catch (e: any) {
      if (this.steps.length > 0 && this.steps[this.steps.length - 1].error) {
        // We already caught it
        return;
      }
      // Fallback to simulation mode if high-fidelity parsing fails
      this.steps = []; 
      this.processSimulatedCode();
    }
  }

  private processSimulatedCode() {
    // Advanced Regex-based simulation for non-JS languages
    const lines = this.code.split("\n");
    const vars: Record<string, any> = {};
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      
      // Basic Int/Var Assignment
      const assignMatch = trimmed.match(/(?:int|let|var|auto)\s+(\w+)\s*=\s*([^;]+)/) || trimmed.match(/(\w+)\s*=\s*([^;]+)/);
      if (assignMatch) {
         const name = assignMatch[1];
         let valRaw = assignMatch[2].trim();
         
         if (valRaw.startsWith("[") || valRaw.startsWith("{")) {
            vars[name] = valRaw.replace(/[{}]/g, '').split(',').map(v => v.trim().replace(/['"]/g, ''));
         } else {
            vars[name] = isNaN(Number(valRaw)) ? valRaw : Number(valRaw);
         }
      }

      // Simple Array/List index update (arr[i] = val)
      const indexMatch = trimmed.match(/(\w+)\[([^\]]+)\]\s*=\s*([^;]+)/);
      if (indexMatch) {
         const name = indexMatch[1];
         // Simple simulation: we just record that something changed
         if (vars[name] && Array.isArray(vars[name])) {
            vars[name] = [...vars[name]]; // trigger update
         }
      }

      if (trimmed && !trimmed.startsWith("//") && !trimmed.startsWith("#") && trimmed !== "{" && trimmed !== "}") {
        this.steps.push({
          line: idx + 1,
          variables: { ...vars },
          callStack: ["main"],
          nodeType: "Statement",
          memory: []
        });
      }
    });
  }

  public getSteps() {
    return this.steps;
  }
}
