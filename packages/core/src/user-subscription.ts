import { Entity, EntityItem } from "electrodb"
import { Dynamo } from "./dynamo"
export * as UserSubscription from "./user-subscription"

const UserSubscriptionEntity = new Entity(
    {
        model: {
            entity: "userSubscription",
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
            stripeCustomerId: {
                type: "string",
                required: false,
            },
            stripeSubscriptionId: {
                type: "string",
                required: false,
            },
            stripePriceId: {
                type: "string",
                required: false,
            },
            stripeCurrentPeriodEnd: {
                type: "number",
                required: false,
            },
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

export type Info = EntityItem<typeof UserSubscriptionEntity>


export async function create(input: {
    id: string
    userId: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    stripePriceId: string
    stripeCurrentPeriodEnd: number
}): Promise<Info> {
    try {
        const result = await UserSubscriptionEntity.client
            .transactWrite({
                TransactItems: [
                    {
                        Put: UserSubscriptionEntity.create({
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
    const result = await UserSubscriptionEntity.get({
        id,
    }).go()
    return result.data
}