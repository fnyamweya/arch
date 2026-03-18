/**
 * Minimal OpenAPI 3.0 type definitions used by the spec builder.
 * Only the subset actually referenced is declared here.
 */
export namespace OpenAPIV3 {
  export interface Document {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    tags?: TagObject[];
    paths: PathsObject;
    components?: ComponentsObject;
  }

  export interface InfoObject {
    title: string;
    version: string;
    description?: string;
  }

  export interface ServerObject {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariableObject>;
  }

  export interface ServerVariableObject {
    default: string;
    enum?: string[];
    description?: string;
  }

  export interface TagObject {
    name: string;
    description?: string;
  }

  export type PathsObject = Record<string, PathItemObject>;

  export interface PathItemObject {
    get?: OperationObject;
    post?: OperationObject;
    put?: OperationObject;
    patch?: OperationObject;
    delete?: OperationObject;
  }

  export interface OperationObject {
    operationId?: string;
    tags?: string[];
    summary?: string;
    description?: string;
    security?: SecurityRequirementObject[];
    parameters?: ParameterObject[];
    requestBody?: RequestBodyObject;
    responses: Record<string, ResponseObject>;
  }

  export type SecurityRequirementObject = Record<string, string[]>;

  export interface ParameterObject {
    name: string;
    in: "query" | "header" | "path" | "cookie";
    required?: boolean;
    description?: string;
    schema?: SchemaObject | ReferenceObject;
  }

  export interface RequestBodyObject {
    required?: boolean;
    content: Record<string, MediaTypeObject>;
  }

  export interface ResponseObject {
    description: string;
    content?: Record<string, MediaTypeObject>;
  }

  export interface MediaTypeObject {
    schema?: SchemaObject | ReferenceObject;
  }

  export interface ReferenceObject {
    $ref: string;
  }

  export interface SchemaObject {
    type?: string;
    format?: string;
    pattern?: string;
    enum?: unknown[];
    minItems?: number;
    allOf?: Array<SchemaObject | ReferenceObject>;
    items?: SchemaObject | ReferenceObject;
    properties?: Record<string, SchemaObject | ReferenceObject>;
    required?: string[];
    nullable?: boolean;
    description?: string;
    example?: unknown;
    additionalProperties?: boolean | SchemaObject | ReferenceObject;
  }

  export interface SecuritySchemeObject {
    type: string;
    scheme?: string;
    bearerFormat?: string;
    description?: string;
  }

  export interface ComponentsObject {
    securitySchemes?: Record<string, SecuritySchemeObject>;
    schemas?: Record<string, SchemaObject>;
    parameters?: Record<string, ParameterObject>;
  }
}
