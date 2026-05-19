import * as tsModule from 'typescript'

type TypeScriptModule = typeof tsModule

const tsExport: TypeScriptModule =
  (tsModule as TypeScriptModule & { default?: TypeScriptModule }).default ??
  tsModule

export const ts: TypeScriptModule = tsExport
export type { TypeScriptModule }
