import { Entity, EntityItem } from "electrodb"
import { Dynamo } from "./dynamo"
export * as Stories from "./stories"

const StoryEntity = new Entity(
    {
        model: {
            entity: "stories",
            version: "1",
            service: "bedtimeai",
        },
        attributes: {
            userId: {
                type: "string",
                required: true,
            },
            story: {
                type: "string",
                required: true,
            },
            createdAt: {
                type: "number",
                readOnly: true,
                required: true,
                default: () => Date.now(),
                set: () => Date.now(),
            }
        },
        indexes: {
            primary: {
                pk: {
                    field: "pk",
                    composite: ["userId"],
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

export type Info = EntityItem<typeof StoryEntity>


export async function create(input: {
    userId: string
    story: string
}): Promise<Info> {
    try {
        const result = await StoryEntity.client
            .transactWrite({
                TransactItems: [
                    {
                        Put: StoryEntity.create({
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

export async function get(userId: string) {
    const result = await StoryEntity.get({
        userId,
    }).go()
    return result.data
}