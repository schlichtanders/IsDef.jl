```@meta
CurrentModule = IsDef
DocTestSetup = quote
    using IsDef
end
```

# Manual

This package provides primitives for dispatching on whether certain methods are implemented or not.
It exports two functions for general usage
* `isdef(f, Arg1Type, Arg2Type, ...)::Bool` and
* `Out(f, Arg1Type, Arg2Type)::ReturnType`
which build upon an internal function `IsDef.return_type(Tuple{typeof(f), Arg1Type, Arg2Type, ...})::ReturnType`.

## Limitations

Use `isdef` / `Out` for your dispatch cases, but be aware that sometimes Julia's inference is only approximate.
The package does a lot to improve over the default inference, but there are still limitations, just that you know:
1. sometimes the inferred type may be more general then the real concrete type
2. sometimes a type is inferred, while in real an error is thrown (this especially holds true if one of your ArgTypes is `Any`)

Accordingly, here some notes about safety:
* `isdef` is usually safe to use, as you don't care about the specific return type. In the rare case that some function was actually not defined despite saying so, you will get a loud MethodError at runtime, precisely stating which method was not defined. Then you can fix the missing type-inference yourself by overloading `IsDef.return_type` (see below) and you are safe to go.
* `Out` is definitely trickier, as here the precise type may matter. The general recommendation is actually to not use this kind of custom type-inference at all, but instead always try to use values directly and let the compiler optimise the code instead. For more information see for example [this discourse discussion](https://discourse.julialang.org/t/promote-op-and-preallocating-result-of-linear-operators/11332/2) about the similar function `Base.promote_op`. Use `Out` only if you cannot do the same with values only, e.g. if you work with empty containers which don't have any values, or some fancy constructs relying on functions. In addition, make sure it is okay for your use-case that `Out` may return more general types in some cases. That should be enough for the warning.


If you encounter limitations or too broad type-inference, you can always overload the underlying `return_type`.
```julia
IsDef.return_type(::Type{Tuple{typeof(myfunction), Arg1Type, Arg2Type}}) = ReturnType
```
Specifically, if you want to indicate that a given function is not defined for certain argument types, you return `Union{}`
```julia
# NotApplicable denotes being undefined
IsDef.return_type(::Type{Tuple{typeof(myfunction), Arg1Type, Arg2Type}}) = NotApplicable  
```

## Loading IsDef

```julia
using IsDef
```
makes `isdef` and `Out` available.


## `isdef(f, ...)`

`isdef` checks whether a given function is defined for subsequent argument-types

```jldoctest global
julia> isdef(+, Int, Int)
true
julia> isdef(-, AbstractFloat)
true
julia> isdef(-, String)
false
julia> isdef(-, AbstractString)
false
```

Caution has to be taken for the type `Any`. It is the only special case. It is interpreted as if type-inference was in-accurate, and the concrete values are actually something more specific than Any. This is why, `Any` always results in `true`.

```jldoctest global
julia> isdef(-, Any)
true
```

## `Out(f, ...)`

`Out` follows the same syntax as `isdef` however instead of returning a Bool, it returns the actual inferred returntype.
<!-- surprisingly in julia nightly this no longer works, the output is instead "Vector{String} = Array{String,1}" -->
```julia
julia> Out(Base.map, typeof(string), Vector{Int})
Array{String,1}
```

If the function is not defined, it returns a special exported type `NotApplicable` (and not the standard convention `Union{}`). This ensures that `Out` can be used for dispatch.
```jldoctest global
julia> Out(-, AbstractString)
NotApplicable
```

You can also do higher-order inference, e.g. when working with `Base.map`. Usually you would need a concrete function for its first argument, like
<!-- surprisingly in julia nightly this no longer works, the output is instead "Vector{Bool} = Array{Bool,1}" -->
```julia
julia> Out(Base.map, typeof(isodd), Vector{Int})
Array{Bool,1}
```
But thanks to the package `FunctionWrappers` you can define Function types also directly, without having a concrete function:
<!-- surprisingly in julia nightly this no longer works, the output is instead "Vector{Bool} = Array{Bool,1}" -->
```julia
julia> import FunctionWrappers: FunctionWrapper

julia> Out(Base.map, FunctionWrapper{Bool, Tuple{Any}}, Vector{Int})
Array{Bool,1}
```

--------------------------

Be cautious about `Any`, as it will usually work for every function, resulting again in an `Any`.
```jldoctest global
julia> Out(-, Any)
Any
```


## What if I only have a function-type? Use `apply`

`IsDef` also exports a little helper function `apply` which you can use to infer with function-types instead of function-instances.
```jldoctest global
julia> isdef(apply, typeof(sin), Int)
true
julia> Out(apply, typeof(sin), Int)
Float64
```

The implementation in the background actually ensures that this takes into account custom fixes of `IsDef.return_type`, too.
```jldoctest global
struct MyNewType end
IsDef.return_type(::Type{Tuple{typeof(identity), MyNewType}}) = NotApplicable
isdef(apply, typeof(identity), MyNewType)

# output
false
```

!!! warning "This only works with the `IsDef.apply`"
    A custom apply won't work
    ```julia
    isdef((f, args...) -> f(args...), typeof(identity), MyNewType)
    # output
    true
    ```

```@meta
DocTestSetup = nothing
```
