/* GENERATED, DO NOT EDIT DIRECTLY */

export interface NoRestrictedPathsSchema0 {
  /**
   * @minItems 1
   */
  zones?: [{
    target?: (string | [string, ...(string)[]])
    from?: (string | [string, ...(string)[]])
    except?: string[]
    message?: string
  }, ...({
    target?: (string | [string, ...(string)[]])
    from?: (string | [string, ...(string)[]])
    except?: string[]
    message?: string
  })[]]
  basePath?: string
}

export type NoRestrictedPathsRuleOptions = [NoRestrictedPathsSchema0?]

export type RuleOptions = NoRestrictedPathsRuleOptions
export type MessageIds = 'path' | 'mixedGlob' | 'glob' | 'zone'
