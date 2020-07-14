var documenterSearchIndex = {"docs":
[{"location":"library/","page":"Library","title":"Library","text":"CurrentModule = IsDef","category":"page"},{"location":"library/#Public-API","page":"Library","title":"Public API","text":"","category":"section"},{"location":"library/","page":"Library","title":"Library","text":"","category":"page"},{"location":"library/#Core","page":"Library","title":"Core","text":"","category":"section"},{"location":"library/","page":"Library","title":"Library","text":"isdef\nOut\nreturn_type","category":"page"},{"location":"library/#IsDef.isdef","page":"Library","title":"IsDef.isdef","text":"isdef(func, ArgType1, ArgType2, ...)::Bool\nisdef(f, args...) = isdef(f, typeof.(args)...)\n\nChecks whether the function is defined for the actual types or not. This works in compile time and hence can be used to optimize code.\n\nWhen called on values, the values will be cast to types via use of typeof for convenience.\n\nwarning: CAUTION\nIf isdef(...) == true, still a MethodError might happen at runtime. This is due to incomplete type inference.SOLUTION: Overload IsDef.return_type if you experience unexpected behaviour for your typesFor instance to say that some call like myfunc(::Int, ::String) is not defined, then define the followingfunction IsDef.return_type(::Type{Tuple{typeof(myfunc), TypeArg1, TypeArg2}})\n  Union{}  # return empty Union to indicate something is not defined\nend\n\nSemantics\n\nThe implementation follows a closed-world semantics in that isdef will return true for a given abstract type, if the function is defined for all currently defined leaf types of that abstract type.\n\nThe only exceptions currently are Any, Function,  and Exception, for which isdef returns true.\n\n\n\n\n\n","category":"function"},{"location":"library/#IsDef.Out","page":"Library","title":"IsDef.Out","text":"Out(func, ArgType1, ArgType2, ...)::ReturnType\nOut(f, args...) = isdef(f, typeof.(args)...)\n\nReturns outputtype of function application. Returns Traits.NotApplicable if compiler notices that no Method can be found.\n\nWhen called on values, the values will be cast to types via use of typeof for convenience.\n\nwarning: CAUTION\nIf Out(...) == Any, still a MethodError might happen at runtime. This is due to incomplete type inference.SOLUTION: Overload IsDef.return_type if you experience unexpected behaviour for your typesFor instance to say that some call like myfunc(::Int, ::String) is not defined, then define the followingfunction IsDef.return_type(::Type{Tuple{typeof(myfunc), TypeArg1, TypeArg2}})\n  Union{}  # return empty Union to indicate something is not defined\nend\n\nUnionAll types and abstract types are concretified to the Union of their existing subtypes, in order to improve type-inference. The only exceptions so far are Any, Function and Exception, as they have way too many subtypes to be of practical use.\n\n\n\n\n\n","category":"function"},{"location":"library/#IsDef.return_type","page":"Library","title":"IsDef.return_type","text":"wrapper arround Julia's type inference\n\nThis should be overloaded if you want to fix certain wrong typeinferences for your custom types. It is used internally by both isdef and Out.\n\nReturning Union{} is interpreted as MethodError.\n\n\n\n\n\n","category":"function"},{"location":"library/#Other-helpers","page":"Library","title":"Other helpers","text":"","category":"section"},{"location":"library/","page":"Library","title":"Library","text":"apply\n∨","category":"page"},{"location":"library/#IsDef.apply","page":"Library","title":"IsDef.apply","text":"just applies a given function to arguments and keyword arguments\n\nThis little helper is crucial if you want to typeinfer when only knowing the function type instead of the function instance.\n\n\n\n\n\n","category":"function"},{"location":"library/#IsDef.:∨","page":"Library","title":"IsDef.:∨","text":"TypeA ∨ TypeB = promote_type(TypeA, TypeB)\n∨(values...) = ∨(typeof.(values)...)\n\n∨ (latex \\vee) is alias for promote_type.\n\nWhen called on values, the values will be cast to types via use of typeof for convenience.\n\n\n\n\n\n","category":"function"},{"location":"manual/","page":"Manual","title":"Manual","text":"CurrentModule = IsDef\nDocTestSetup = quote\n    using IsDef\nend","category":"page"},{"location":"manual/#Manual","page":"Manual","title":"Manual","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"This package provides primitives for dispatching on whether certain methods are implemented or not. It exports two functions for general usage","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"isdef(f, Arg1Type, Arg2Type, ...)::Bool and\nOut(f, Arg1Type, Arg2Type)::ReturnType","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"which build upon an internal function IsDef.return_type(Tuple{typeof(f), Arg1Type, Arg2Type, ...})::ReturnType.","category":"page"},{"location":"manual/#Limitations","page":"Manual","title":"Limitations","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"Use isdef / Out for your dispatch cases, but be aware that sometimes Julia's inference is only approximate. The package does a lot to improve over the default inference, but there are still limitations, just that you know:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"sometimes the inferred type may be more general then the real concrete type\nsometimes a type is inferred, while in real an error is thrown (this especially holds true if one of your ArgTypes is Any)","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Accordingly, here some notes about safety:","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"isdef is usually safe to use, as you don't care about the specific return type. In the rare case that some function was actually not defined despite saying so, you will get a loud MethodError at runtime, precisely stating which method was not defined. Then you can fix the missing type-inference yourself by overloading IsDef.return_type (see below) and you are safe to go.\nOut is definitely trickier, as here the precise type may matter. The general recommendation is actually to not use this kind of custom type-inference at all, but instead always try to use values directly and let the compiler optimise the code instead. For more information see for example this discourse discussion about the similar function Base.promote_op. Use Out only if you cannot do the same with values only, e.g. if you work with empty containers which don't have any values, or some fancy constructs relying on functions. In addition, make sure it is okay for your use-case that Out may return more general types in some cases. That should be enough for the warning.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"If you encounter limitations or too broad type-inference, you can always overload the underlying return_type.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"IsDef.return_type(::Type{Tuple{typeof(myfunction), Arg1Type, Arg2Type}}) = ReturnType","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Specifically, if you want to indicate that a given function is not defined for certain argument types, you return Union{}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"# Union{} denotes being undefined\nIsDef.return_type(::Type{Tuple{typeof(myfunction), Arg1Type, Arg2Type}}) = Union{}  ","category":"page"},{"location":"manual/#Loading-IsDef","page":"Manual","title":"Loading IsDef","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"using IsDef","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"makes isdef and Out available.","category":"page"},{"location":"manual/#isdef(f,-...)","page":"Manual","title":"isdef(f, ...)","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"isdef checks whether a given function is defined for subsequent argument-types","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> isdef(+, Int, Int)\ntrue\njulia> isdef(-, AbstractFloat)\ntrue\njulia> isdef(-, String)\nfalse\njulia> isdef(-, AbstractString)\nfalse","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Caution has to be taken for the type Any. It is the only special case. It is interpreted as if type-inference was in-accurate, and the concrete values are actually something more specific than Any. This is why, Any always results in true.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> isdef(-, Any)\ntrue","category":"page"},{"location":"manual/#Out(f,-...)","page":"Manual","title":"Out(f, ...)","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"Out follows the same syntax as isdef however instead of returning a Bool, it returns the actual inferred returntype. <!– surprisingly in julia nightly this no longer works, the output is instead \"Vector{String} = Array{String,1}\" –>","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> Out(Base.map, typeof(string), Vector{Int})\nArray{String,1}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"If the function is not defined, it returns a special exported type NotApplicable (and not the standard convention Union{}). This ensures that Out can be used for dispatch.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> Out(-, AbstractString)\nNotApplicable","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"You can also do higher-order inference, e.g. when working with Base.map. Usually you would need a concrete function for its first argument, like <!– surprisingly in julia nightly this no longer works, the output is instead \"Vector{Bool} = Array{Bool,1}\" –>","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> Out(Base.map, typeof(isodd), Vector{Int})\nArray{Bool,1}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"But thanks to the package FunctionWrappers you can define Function types also directly, without having a concrete function: <!– surprisingly in julia nightly this no longer works, the output is instead \"Vector{Bool} = Array{Bool,1}\" –>","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> import FunctionWrappers: FunctionWrapper\n\njulia> Out(Base.map, FunctionWrapper{Bool, Tuple{Any}}, Vector{Int})\nArray{Bool,1}","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"Be cautious about Any, as it will usually work for every function, resulting again in an Any.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> Out(-, Any)\nAny","category":"page"},{"location":"manual/#What-if-I-only-have-a-function-type?-Use-apply","page":"Manual","title":"What if I only have a function-type? Use apply","text":"","category":"section"},{"location":"manual/","page":"Manual","title":"Manual","text":"IsDef also exports a little helper function apply which you can use to infer with function-types instead of function-instances.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"julia> isdef(apply, typeof(sin), Int)\ntrue\njulia> Out(apply, typeof(sin), Int)\nFloat64","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"The implementation in the background actually ensures that this takes into account custom fixes of IsDef.return_type, too.","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"struct MyNewType end\nIsDef.return_type(::Type{Tuple{typeof(identity), MyNewType}}) = Union{}\nisdef(apply, typeof(identity), MyNewType)\n\n# output\nfalse","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"warning: This only works with the `IsDef.apply`\nA custom apply won't workisdef((f, args...) -> f(args...), typeof(identity), MyNewType)\n# output\ntrue","category":"page"},{"location":"manual/","page":"Manual","title":"Manual","text":"DocTestSetup = nothing","category":"page"},{"location":"#IsDef.jl","page":"Home","title":"IsDef.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package provides primitives for dispatching on whether certain methods are implemented or not. It exports two functions for general usage","category":"page"},{"location":"","page":"Home","title":"Home","text":"isdef(f, Arg1Type, Arg2Type, ...)::Bool and\nOut(f, Arg1Type, Arg2Type)::ReturnType","category":"page"},{"location":"","page":"Home","title":"Home","text":"which build upon an internal function IsDef.return_type(Tuple{typeof(f), Arg1Type, Arg2Type, ...})::ReturnType.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"using Pkg\npkg\"registry add https://github.com/JuliaRegistries/General\"  # central julia repository\npkg\"registry add https://github.com/schlichtanders/SchlichtandersJuliaRegistry.jl\"  # custom repository\npkg\"add IsDef\"","category":"page"},{"location":"","page":"Home","title":"Home","text":"After installation, use the package by simply","category":"page"},{"location":"","page":"Home","title":"Home","text":"using IsDef","category":"page"},{"location":"","page":"Home","title":"Home","text":"which makes isdef and Out available.","category":"page"},{"location":"#Manual-Outline","page":"Home","title":"Manual Outline","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\"manual.md\"]","category":"page"},{"location":"#main-index","page":"Home","title":"Library Index","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\"library.md\"]","category":"page"}]
}