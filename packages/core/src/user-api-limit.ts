import { Entity, EntityItem } from "electrodb"
import { Dynamo } from "./dynamo"
export * as UserApiLimit from "./user-api-limit"

const UserApiLimitEntity = new Entity(
    {
        model: {
            entity: "userApiLimit",
            version: "1",
            service: "bedtimeai",
        },
        attributes: {
            id: {
                type: "string",
                required: true,
            },
            userId: {
                type: "string",
                required: true,
            },
            count: {
                type: "number",
                required: true,
            },
            createdAt: {
                type: "number",
                readOnly: true,
                required: true,
                default: () => Date.now(),
                set: () => Date.now(),
            },
            updatedAt: {
                type: "number",
                watch: "*",
                required: true,
                default: () => Date.now(),
                set: () => Date.now(),
            }
        },
        indexes: {
            primary: {
                pk: {
                    field: "pk",
                    composite: ["id"],
                },
                sk: {
                    field: "sk",
                    composite: [],
                },
            },
        },
    },
    Dynamo.Service
)

export type Info = EntityItem<typeof UserApiLimitEntity>


export async function create(input: {
    id: string
    userId: string
    count: number
    createdAt: number
    updatedAt: number
}): Promise<Info> {
    try {
        const result = await UserApiLimitEntity.client
            .transactWrite({
                TransactItems: [
                    {
                        Put: UserApiLimitEntity.create({
                            ...input,
                        }).params(),
                    },
                ],
            })
            .promise()
        return result
    } catch {
        return create(input)
    }
}

export async function get(id: string) {
    const result = await UserApiLimitEntity.get({
        id,
    }).go()
    return result.data
}