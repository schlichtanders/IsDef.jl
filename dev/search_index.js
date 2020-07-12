var documenterSearchIndex = {"docs":
[{"location":"library/","page":"IsDef","title":"IsDef","text":"CurrentModule = IsDef","category":"page"},{"location":"library/#IsDef","page":"IsDef","title":"IsDef","text":"","category":"section"},{"location":"library/","page":"IsDef","title":"IsDef","text":"","category":"page"},{"location":"library/","page":"IsDef","title":"IsDef","text":"Modules = [IsDef]","category":"page"},{"location":"library/#IsDef.IsDef","page":"IsDef","title":"IsDef.IsDef","text":"To more easily dispatch on the availability of functions, this package offers two essential helpers:\n\n`isdef(f, TypeArg1, TypeArg2, ...)` and `Out(f, TypeArg1, TypeArg2, ...)`\n\nCurrently the implementation follows a closed-world semantics in that isdef will return true for a given abstract type, if the function is defined for all currently defined leaf types of that abstract type.\n\nThe only exception is Any, for which isdef returns true only if given an abstract type, the function is defined for a newtype of the abstract type. (E.g. f(a) = 1 )\n\n\n\n\n\n","category":"module"},{"location":"library/#IsDef.:∨","page":"IsDef","title":"IsDef.:∨","text":"∨ (latex ee) is alias for promote_type\n\nwhen called on values, the values will be cast to types via use of typeof for convenience\n\n\n\n\n\n","category":"function"},{"location":"library/#IsDef.Out-Tuple{Any,Vararg{Type,N} where N}","page":"IsDef","title":"IsDef.Out","text":"returns outputtype of function application\n\nReturns TraitsNotApplicable if compiler notices that no Method can be found\n\nCAUTION: If Out() == Any, still a MethodError might happen at runtime. This is due to incomplete type inference.\n\nSOLUTION: Overload IsDefreturn_type if you experience unexpected behaviour for your types For instance to say that some call like myfunc(Int String) is not defined, then define the following\n\nfunction IsDef.return_type(::Type{Tuple{typeof(myfunc), TypeArg1, TypeArg2}})\n  Union{}  # return empty Union to indicate something is not defined\nend\n\n\n\n\n\n","category":"method"},{"location":"library/#IsDef._return_type-Tuple{Union}","page":"IsDef","title":"IsDef._return_type","text":"_return_type can either except\n\na Union (which may be created by Type2Union)\n\n_ or a Tuple (which will be the final call signature)\n\nImportantly, the semantics is that if at least one of the Union types infers Union{} then Union{} is inferred in total.\n\n\n\n\n\n","category":"method"},{"location":"library/#IsDef.apply-Tuple{Any,Vararg{Any,N} where N}","page":"IsDef","title":"IsDef.apply","text":"just applies a given function to arguments and keyword arguments\n\nThis little helper is crucial if you want to typeinfer when only knowing the function type instead of the function instance.\n\n\n\n\n\n","category":"method"},{"location":"library/#IsDef.isdef-Tuple{Any,Vararg{Type,N} where N}","page":"IsDef","title":"IsDef.isdef","text":"checks whether the function is defined for the actual types or not\n\nThis works in compile time and hence can be used to optimize code.\n\nIMPORTANT: Overload IsDefreturn_type if you experience unexpected behaviour for your types For instance to say that some call like myfunc(Int String) is not defined define the following\n\nfunction IsDef.return_type(::Type{Tuple{typeof(myfunc), TypeArg1, TypeArg2}})\n  Union{}  # return empty Union to indicate something is not defined\nend\n\n\n\n\n\n","category":"method"},{"location":"library/#IsDef.@redefine_generated-Tuple{}","page":"IsDef","title":"IsDef.@redefine_generated","text":"for some reasons the @generated macro triggers too early and leads Union{} for some types\n\ncalling this macro will redefine the @generated functions accordingly so that new TypeDefinitions are properly included\n\n\n\n\n\n","category":"macro"},{"location":"manual/","page":"Manual","title":"Manual","text":"CurrentModule = IsDef","category":"page"},{"location":"manual/#Manual","page":"Manual","title":"Manual","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"This package provides primitives for dispatching on whether certain methods are implemented or not. It exports two functions for general usage","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"isdef(f, Arg1Type, Arg2Type, ...)::Bool and\nOut(f, Arg1Type, Arg2Type)::ReturnType","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"which build upon an internal function IsDef.return_type(Tuple{typeof(f), Arg1Type, Arg2Type, ...})::ReturnType.","category":"page"},{"location":"manual/#Limitations","page":"Manual","title":"Limitations","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"Use isdef / Out for your dispatch cases, but be aware that sometimes Julia's inference is only approximate. The package does a lot to improve over the default inference, but there are still limitations, just that you know:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"sometimes the inferred type may be more general then the real concrete type\nsometimes a type is inferred, while in real an error is thrown (this especially holds true if one of your ArgTypes is Any)","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Accordingly, here some notes about safety:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"isdef is usually safe to use, as you don't care about the specific return type. In the rare case that some function was actually not defined despite saying so, you will get a loud MethodError at runtime, precisely stating which method was not defined. Then you can fix the missing type-inference yourself by overloading IsDef.return_type (see below) and you are safe to go.\nOut is definitely trickier, as here the precise type may matter. The recommendation is to use it only if you are fine with (1.), i.e. it is okay for you if you get a more general type in some cases.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"If you encounter limitations or too broad type-inference, you can always overload the underlying return_type","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"IsDef.return_type(::Type{Tuple{typeof(myfunction), Arg1Type, Arg2Type}}) = ReturnType","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Specifically, if you want to indicate that a given function is not defined for certain argument types, you return Union{}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"# Union{} denotes being undefined\nIsDef.return_type(::Type{Tuple{typeof(myfunction), Arg1Type, Arg2Type}}) = Union{}  ","category":"page"},{"location":"manual/#Loading-IsDef","page":"Manual","title":"Loading IsDef","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"Run","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"using IsDef","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"which makes isdef and Out available.","category":"page"},{"location":"manual/#isdef(f,-...)","page":"Manual","title":"isdef(f, ...)","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"isdef checks whether a given function is defined for subsequent argument-types","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> isdef(+, Int, Int)\ntrue\njulia> isdef(-, AbstractFloat)\ntrue\njulia> isdef(-, String)\nfalse\njulia> isdef(-, AbstractString)\nfalse","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Caution has to be taken for the type Any. It is the only special case. It is interpreted as if type-inference was in-accurate, and the concrete values are actually something more specific than Any. This is why, Any always results in true.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> isdef(-, Any)\ntrue","category":"page"},{"location":"manual/#Out(f,-...)","page":"Manual","title":"Out(f, ...)","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"Out follows the same syntax as isdef however instead of returning a Bool, it returns the actual inferred returntype.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> Out(Base.map, typeof(string), Vector{Int})\nVector{String}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"If the function is not defined, it returns a special exported type NotApplicable (and not the standard convention Union{}). This ensures that Out can be used for dispatch.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> Out(-, AbstractString)\nIsDef.NotApplicable","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"You can also do higher-order inference, e.g. when working with Base.map. Usually you would need a concrete function for its first argument, like","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> Out(Base.map, typeof(isodd), Vector{Int})\nArray{Bool, 1}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"But thanks to the package FunctionWrappers you can define Function types also directly, without having a concrete function:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> import FunctionWrappers: FunctionWrapper\njulia> Out(Base.map, FunctionWrapper{Bool, Tuple{Any}}, Vector{Int})\nVector{Bool}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Be cautious about Any, as it will usually work for every function, resulting again in an Any.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Out(-, Any)  # Any","category":"page"},{"location":"manual/#What-if-I-only-have-a-function-type?-Use-apply","page":"Manual","title":"What if I only have a function-type? Use apply","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"IsDef also exports a little helper function apply which you can use to infer with function-types instead of function-instances.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> isdef(apply, typeof(sin), Int)\ntrue\njulia> Out(apply, typeof(sin), Int)\nFloat64","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"The implementation in the background actually ensures that this takes into account custom fixes of IsDefreturn_type, too.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"struct MyNewType end\nIsDef.return_type(::Type{Tuple{typeof(identity), MyNewType}}) = Union{}\nisdef(apply, typeof(identity), MyNewType)\n\n# Output\n\nfalse","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"warning: This only works with the `IsDef.apply`\nA custom apply won't workisdef((f, args...) -> f(args...), typeof(identity), MyNewType)\n\n# output\n\ntrue","category":"page"},{"location":"#IsDef.jl","page":"Home","title":"IsDef.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package provides primitives for dispatching on whether certain methods are implemented or not. It exports two functions for general usage","category":"page"},{"location":"","page":"Home","title":"Home","text":"isdef(f, Arg1Type, Arg2Type, ...)::Bool and\nOut(f, Arg1Type, Arg2Type)::ReturnType","category":"page"},{"location":"","page":"Home","title":"Home","text":"which build upon an internal function IsDef.return_type(Tuple{typeof(f), Arg1Type, Arg2Type, ...})::ReturnType.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"using Pkg\npkg\"registry add https://github.com/JuliaRegistries/General\"  # central julia repository\npkg\"registry add https://github.com/schlichtanders/SchlichtandersJuliaRegistry.jl\"  # custom repository\npkg\"add IsDef\"","category":"page"},{"location":"","page":"Home","title":"Home","text":"After installation, use the package by simply","category":"page"},{"location":"","page":"Home","title":"Home","text":"using IsDef","category":"page"},{"location":"","page":"Home","title":"Home","text":"which makes isdef and Out available.","category":"page"},{"location":"#Manual-Outline","page":"Home","title":"Manual Outline","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\"manual.md\"]","category":"page"},{"location":"#main-index","page":"Home","title":"Library Index","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\"library.md\"]","category":"page"}]
}
