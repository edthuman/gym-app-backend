import { Document, WithId } from "mongodb";
import db from "../connection";
import { checkExerciseOrder, checkExerciseSort, findInvalidExerciseQueries, getExerciseError, sortExercises } from "../src/utils/exercise.utils";

const exercises: WithId<Document>[] = []

beforeAll( async () => {
    const exercisesCluster = (await db).collection("exercises").find({})
    for await (const exercise of exercisesCluster){
        exercises.push(exercise)
    }
})

describe("getExerciseError", () => {
    it("returns an empty string for a valid exercise object", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            category: "category",
            icon: "filename"
        }

        const output = getExerciseError(input)

        expect(output).toBe("")
    })
    it("returns correct error message when given an empty object", () => {
        const input = {}
        const output = getExerciseError(input)

        expect(output).toBe("No request body given")
    })
    it("returns correct error message when exercise missing name property", () => {
        const input = { 
            description: "description",
            category: "category",
            icon: "filename"
        }
        const output = getExerciseError(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise missing description property", () => {
        const input = { 
            name: "exercise name",
            category: "category",
            icon: "filename"
        }
        const output = getExerciseError(input)

        expect(output).toBe("No description given")
    })
    it("returns correct error message when exercise missing category property", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            icon: "filename"
        }
        const output = getExerciseError(input)

        expect(output).toBe("No category given")
    })
    it("returns correct error message when exercise missing icon property", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            category: "category"
        }
        const output = getExerciseError(input)

        expect(output).toBe("No icon given")
    })
    it("returns correct error message when exercise missing multiple properties", () => {
        const input = { icon: "file" }
        const output = getExerciseError(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise name is an empty string", () => {
        const input = { 
            name: "",
            description: "description",
            category: "category",
            icon: "filename"
        }
        const output = getExerciseError(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise description is an empty string", () => {
        const input = {
            name: "exercise name",
            description: "",
            category: "category",
            icon: "filename"
        }
        const output = getExerciseError(input)

        expect(output).toBe("No description given")
    })
    it("returns correct error message when exercise category is an empty string", () => {
        const input = {
            name: "exercise name",
            description: "description",
            category: "",
            icon: "filename"
        }
        const output = getExerciseError(input)

        expect(output).toBe("No category given")
    })
    it("returns correct error message when exercise icon is an empty string", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            category: "category",
            icon: ""
        }
        const output = getExerciseError(input)

        expect(output).toBe("No icon given")
    })
    it("returns correct error message when exercise name is not a string", () => {
        const description = "description"
        const category = "category"
        const icon = "icon"

        const numberName = { name : 1, description, category, icon }
        const numberOutput = getExerciseError(numberName)

        const arrayName = { name: [], description, category, icon }
        const arrayOutput = getExerciseError(arrayName)
        
        const objectName = { name: {}, description, category, icon }
        const objectOutput = getExerciseError(objectName)

        const expectedOutput = "Name must be a string"

        expect(numberOutput).toBe(expectedOutput)
        expect(arrayOutput).toBe(expectedOutput)
        expect(objectOutput).toBe(expectedOutput)
    })
    it("returns correct error message when exercise description is not a string", () => {
        const name = "name"
        const description = "description"
        const icon = "icon"

        const numberCategory = { name, description, category : 1, icon }
        const numberOutput = getExerciseError(numberCategory)

        const arrayCategory = { name, description, category : [], icon }
        const arrayOutput = getExerciseError(arrayCategory)
        
        const objectCategory = { name, description, category : {}, icon }
        const objectOutput = getExerciseError(objectCategory)

        const expectedOutput = "Category must be a string"

        expect(numberOutput).toBe(expectedOutput)
        expect(arrayOutput).toBe(expectedOutput)
        expect(objectOutput).toBe(expectedOutput)
    })
    it("returns correct error message when exercise description is not a string", () => {
        const name = "name"
        const category = "category"
        const icon = "icon"

        const numberDescription = { name, description: 1, category, icon }
        const numberOutput = getExerciseError(numberDescription)

        const arrayDescription = { name, description: [], category, icon }
        const arrayOutput = getExerciseError(arrayDescription)
        
        const objectDescription = { name, description: {}, category, icon }
        const objectOutput = getExerciseError(objectDescription)

        const expectedOutput = "Description must be a string"

        expect(numberOutput).toBe(expectedOutput)
        expect(arrayOutput).toBe(expectedOutput)
        expect(objectOutput).toBe(expectedOutput)
    })
    it("returns correct error message when exercise icon is not a string", () => {
        const name = "name"
        const description = "description"
        const category = "category"

        const numberIcon = { name, description, category, icon: 1}
        const numberOutput = getExerciseError(numberIcon)

        const arrayIcon = { name, description, category, icon: []}
        const arrayOutput = getExerciseError(arrayIcon)
        
        const objectIcon = { name, description, category, icon: {}}
        const objectOutput = getExerciseError(objectIcon)

        const expectedOutput = "Icon must be a string"

        expect(numberOutput).toBe(expectedOutput)
        expect(arrayOutput).toBe(expectedOutput)
        expect(objectOutput).toBe(expectedOutput)
    })
    it("returns correct error message for an object with extra properties", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            category: "category",
            icon: "filename",
            extraProperty: "value"
        }

        const output = getExerciseError(input)

        expect(output).toBe("Request body should only include name, description, category, and icon")
    })
})

describe("sortExercises", () => {
    it("returns exercise array sorted by ascending _id when sort and order are undefined", () => {
        const output = sortExercises(exercises, undefined, undefined)
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })

        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending name when sort is an empty string", () => {
        const output = sortExercises(exercises, "", undefined)
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a.name.toLowerCase()
            const y = b.name.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending name when sort is 'name", () => {
        const output = sortExercises(exercises, "name", undefined)
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a.name.toLowerCase()
            const y = b.name.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending id when sort is 'id", () => {
        const output = sortExercises(exercises, "id", undefined)
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending id when sort is '_id", () => {
        const output = sortExercises(exercises, "_id", undefined)
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending _id when order is an empty string", () => {
        const output = sortExercises(exercises, undefined, "")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending _id when order is 'asc", () => {
        const output = sortExercises(exercises, undefined, "asc")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending _id when order is 'ASC", () => {
        const output = sortExercises(exercises, undefined, "ASC")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by ascending _id when order is 'ascending", () => {
        const output = sortExercises(exercises, undefined, "ascending")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by descending _id when order is 'desc'", () => {
        const output = sortExercises(exercises, undefined, "desc")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by descending _id when order is 'DESC'", () => {
        const output = sortExercises(exercises, undefined, "DESC")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns exercise array sorted by descending _id when order is 'descending'", () => {
        const output = sortExercises(exercises, undefined, "descending")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("returns correct array when passed both sort and order values", () => {
        const output = sortExercises(exercises, "name", "descending")
        
        const expectedOutput = exercises.toSorted((a: WithId<Document>, b: WithId<Document>) => {
            const x = a.name.toLowerCase()
            const y = b.name.toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedOutput)
    })
    it("does not mutate the original array", () => {
        const exercises = [
            { _id: "1", name: "exerciseA", description: "N/A", icon: "N/A"},
            { _id: "2", name: "exerciseB", description: "N/A", icon: "N/A"}
        ]
        const exercisesCopy = [
            { _id: "1", name: "exerciseA", description: "N/A", icon: "N/A"},
            { _id: "2", name: "exerciseB", description: "N/A", icon: "N/A"} 
        ]

        sortExercises(exercises, "name", "desc")
        
        expect(exercises).toEqual(exercisesCopy)
    })
    it("returns a new array", () => {
        const output = sortExercises(exercises, "name", "desc")
        
        expect(exercises).not.toBe(output)
    })
})

describe("findInvalidExerciseQueries", () => {
    test("returns false when passed a valid query", () => {
        const output = findInvalidExerciseQueries(["sort"])
        expect(output).toBe(false)
    })
    test("returns false when passed two valid queries", () => {
        const output = findInvalidExerciseQueries(["sort", "order"])
        expect(output).toBe(false)
    })
    test("returns false when passed name query in an array", () => {
        const output = findInvalidExerciseQueries(["name"])
        expect(output).toBe(false)
    })
    test("returns false when passed an empty array", () => {
        const output = findInvalidExerciseQueries([])
        expect(output).toBe(false)
    })
    test("returns true when passed a single invalid query", () => {
        const output = findInvalidExerciseQueries(["invalid"])
        expect(output).toBe(true)
    })
    test("returns true when passed two invalid queries", () => {
        const output = findInvalidExerciseQueries(["invalid", "query"])
        expect(output).toBe(true)
    })
    test("returns true when passed a mix of invalid and valid queries", () => {
        const output = findInvalidExerciseQueries(["invalid", "sort", "query", "order"])
        expect(output).toBe(true)
    })
})

describe("checkExerciseSort", () => {
    test("returns false when sort is id", () => {
        const output = checkExerciseSort("id")
        expect(output).toBe(false)
    })
    test("returns false when sort is _id", () => {
        const output = checkExerciseSort("_id")
        expect(output).toBe(false)
    })
    test("returns false when sort is name", () => {
        const output = checkExerciseSort("name")
        expect(output).toBe(false)
    })
    test("returns false when sort is an empty string", () => {
        const output = checkExerciseSort("name")
        expect(output).toBe(false)
    })
    test("returns false when sort is undefined", () => {
        const output = checkExerciseSort(undefined)
        expect(output).toBe(false)
    })
    test("returns true when sort is invalid", () => {
        const output = checkExerciseSort("invalid")
        expect(output).toBe(true)
    })
    test("returns true when sort is undefined as a string", () => {
        const output = checkExerciseSort("undefined")
        expect(output).toBe(true)
    })
    test("returns true when sort is an array", () => {
        const output = checkExerciseSort(["id"])
        expect(output).toBe(true)
    })
    test("returns true when sort is a number", () => {
        const output = checkExerciseSort(3)
        expect(output).toBe(true)
    })
    test("returns true when sort is an object", () => {
        const output = checkExerciseSort({id: "id"})
        expect(output).toBe(true)
    })
})

describe("checkExerciseOrder", () => {
    test("returns false when order is asc", () => {
        const output = checkExerciseOrder("asc")
        expect(output).toBe(false)
    })
    test("returns false when order is ASC", () => {
        const output = checkExerciseOrder("ASC")
        expect(output).toBe(false)
    })
    test("returns false when order is ascending", () => {
        const output = checkExerciseOrder("ascending")
        expect(output).toBe(false)
    })
    test("returns false when order is desc", () => {
        const output = checkExerciseOrder("desc")
        expect(output).toBe(false)
    })
    test("returns false when order is DESC", () => {
        const output = checkExerciseOrder("DESC")
        expect(output).toBe(false)
    })
    test("returns false when order is descending", () => {
        const output = checkExerciseOrder("descending")
        expect(output).toBe(false)
    })
    test("returns false when order is an empty string", () => {
        const output = checkExerciseOrder("")
        expect(output).toBe(false)
    })
    test("returns false when order is undefined", () => {
        const output = checkExerciseOrder(undefined)
        expect(output).toBe(false)
    })
    test("returns true when order is an invalid order", () => {
        const output = checkExerciseOrder("random")
        expect(output).toBe(true)
    })
    test("returns true when order is undefined as a string", () => {
        const output = checkExerciseOrder("undefined")
        expect(output).toBe(true)
    })
    test("returns true when order is a number", () => {
        const output = checkExerciseOrder(1)
        expect(output).toBe(true)
    })
    test("returns true when order is an array", () => {
        const output = checkExerciseOrder(["asc"])
        expect(output).toBe(true)
    })
    test("returns true when order is an object", () => {
        const output = checkExerciseOrder({ asc: "asc" })
        expect(output).toBe(true)
    })
})