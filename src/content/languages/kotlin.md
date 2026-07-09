---
title: Kotlin
slug: kotlin
category: Supported language
summary: Kotlin is analyzed through its compiled JVM output, using the same bytecode-based engine as Java. That covers top-level declarations, delegation, value classes, suspend functions, and more.
seo_title: Kotlin Language Support | AtlasArc Documentation
seo_description: How AtlasArc recognizes Kotlin dependencies through compiled JVM bytecode, including top-level and extension functions, companion and object access, delegation, value classes, suspend functions, and sealed hierarchies.
---

AtlasArc reads Kotlin through the same compiled-bytecode engine it uses for Java, so projects that mix the two languages in one module analyze as a single graph. Because the Kotlin compiler lowers some constructs into generated classes, you may occasionally see synthesized names such as `FormattingKt`, `$Companion`, or `$DefaultImpls` in raw output. These are preserved when they represent a genuine project-internal dependency, and edges still aggregate up to the package level where you read them.

As with Java, this means AtlasArc recognizes the dependencies that survive into compiled JVM output, not every form a relationship takes in source. The constructs that are erased or inlined by the compiler are called out under **Known boundaries** at the end of this page.

## How to read this

Each Kotlin construct falls into one of three states:

- **Recognized**: the construct produces a package dependency edge, and that behaviour is locked down by AtlasArc's dependency-acquisition test suite.
- **Out of scope**: deliberately not modelled, because the relationship does not exist as a static JVM dependency.
- **Not supported**: does not produce a reliable package edge today.

## Construct support

| Construct | Recognition | Notes |
|-----------|-------------|-------|
| Class method calls | Recognized | Calls into another package's class create package edges. |
| Property get and set access | Recognized | Property access lowers to bytecode references that produce edges. |
| Top-level functions | Recognized | The target is the generated file facade, for example `FormattingKt`. |
| Extension functions | Recognized | The target is the generated file facade, for example `SluggingKt`. |
| `suspend` top-level functions | Recognized | The target is the generated file facade, for example `UserGatewayKt`. |
| Companion object access | Recognized | Companion access is retained as a project dependency. |
| `object` singleton access | Recognized | Singleton access creates an edge to the object's package. |
| Default parameters | Recognized | Calls relying on default arguments still produce the target package edge. |
| Interface default implementations | Recognized | Edges may target both the interface and its generated `$DefaultImpls`. |
| Type aliases | Recognized | The underlying compiled type is recognized; the alias itself is not a runtime class. |
| `@JvmInline value class` | Recognized | Using a value class produces an edge to its package. |
| Delegated properties | Recognized | `by RemoteConfig()` creates an edge to the delegate class's package. |
| Class delegation | Recognized | `class Foo : Bar by impl` creates edges to both the interface and the delegate's package. |
| Sealed hierarchy use | Recognized | Matching over sealed members creates edges to the root type and its nested implementations. |
| Anonymous objects | Recognized | An object expression creates an edge to the interface it implements. |
| Java SAM conversion | Recognized | `Validator { ... }` creates an edge to the Java functional interface. |
| Kotlin `fun interface` SAM conversion | Recognized | `NameFilter { ... }` creates an edge to the Kotlin functional interface. |
| Lambda inferred from a parameter type | Recognized | Both the call target and the inferred SAM type's package are recognized, even across packages. |
| Inline functions and `reified` type parameters | Recognized | Reified type use creates an edge to the concrete type; a call to the inline function's owner may be erased when the body is inlined. |
| Multiplatform `expect` / `actual` | Not supported | Acquisition runs against JVM compiler output only. |
| Reflection by string name (`Class.forName("...")`) | Out of scope | String literals are not treated as static architectural dependencies. |
| `const val` compile-time constants | Out of scope | The constant is inlined into the caller, leaving no edge to its declaring file. |
| Source-retention annotations | Out of scope | Source-retention annotations are discarded by the compiler before bytecode acquisition. |
| Metadata-only property annotations | Out of scope | `@property:` annotations can live only in Kotlin metadata, which AtlasArc filters out as graph noise. |
| Debug-only local variable types | Out of scope | A local variable's type that is never otherwise used lives only in debug metadata. |
| Kotlin standard library and `kotlin.Metadata` | Out of scope | Standard-library and metadata references are filtered as non-architectural noise. |

## Known boundaries

A few Kotlin features are real in source but leave little or nothing for a static analyzer to anchor to:

- **Inlined constants.** A `const val` is copied into each caller, so no edge to its declaring file survives compilation.
- **Inline function owners.** When an inline function's body is copied into the call site, the dependencies the body uses can remain, but the edge to the inline function's own package may disappear.
- **Type aliases.** An alias is represented by its underlying compiled type; the alias name and package are not runtime classes.
- **Metadata-only annotations.** Annotations visible only through Kotlin metadata are filtered out, along with `kotlin.Metadata` itself, as graph noise.
- **Non-JVM source sets.** In Kotlin Multiplatform, `expect` / `actual` declarations are analyzed only where they produce JVM bytecode.

When a relationship matters to your architecture, prefer a form the compiler preserves, such as a typed property, a parameter, or a constructor call, so it surfaces where AtlasArc can see it.
