import { BasicValueSource } from "./commonHandles.js"

export default {
    Variable: {
        id: "Variable",
        name: "Variable",
        description: "Basic variable.",
        categories: [],
        targets: {
            values: {
                initial: {}
            },
            signals: {
                set: {
                    action() {
                        return function (newValue) {
                            return this.$ = newValue
                        }
                    }
                }
            }
        },
        sources: {
            values: {
                current: BasicValueSource()
            }
        },
        setup(valueTargets, signalSources) {
            this.$ = valueTargets.initial()
        },
    }
}