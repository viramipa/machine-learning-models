// parser.js
import { Node, Program, Visitor } from 'ast-types';
import { readFileSync } from 'fs';
import * as ts from 'typescript';

class TypeScriptParser {
  parse(fileContent: string) {
    const sourceFile = ts.createSourceFile('temp.ts', fileContent, ts.ScriptTarget.Latest);
    const visitor = new TypeScriptASTVisitor();
    visitor.visit(sourceFile);
    return visitor.getResults();
  }
}

class TypeScriptASTVisitor extends Visitor {
  private results: any[] = [];

  visitNode(node: any) {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      this.results.push({ type: 'CLASS', name: node.name.text });
    } else if (node.kind === ts.SyntaxKind.MethodDeclaration) {
      const method = node as ts.MethodDeclaration;
      this.results.push({
        type: 'METHOD',
        name: method.name.text,
        returnType: this.getTypeName(method.type),
      });
    }
  }

  visitPropertyDeclaration(node: ts.PropertyDeclaration) {
    const property = node;
    this.results.push({
      type: 'PROPERTY',
      name: property.name.text,
      type: this.getTypeName(property.type),
    });
  }

  visitTypeNode(node: ts.TypeNode) {
    if (node.kind === ts.SyntaxKind.SpringType) {
      this.results.push({ type: 'ARRAY', elementType: this.getTypeName(node.typeArguments[0]) });
    } else {
      this.results.push({ type: 'PRIMITIVE', type: this.getTypeName(node) });
    }
  }

  private getTypeName(type: ts.Type) {
    if (type instanceof ts.TypeReference) {
      return type.typeName.getText();
    } else if (type instanceof ts.TypeLiteral) {
      const properties = type.members.map((m) => m.name.getText());
      return `{ ${properties.join(', ')} }`;
    } else {
      return this.getTypeName(type.type);
    }
  }

  getResults() {
    return this.results;
  }
}

function parseFile(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf8');
  const parser = new TypeScriptParser();
  return parser.parse(fileContent);
}

export { parseFile };