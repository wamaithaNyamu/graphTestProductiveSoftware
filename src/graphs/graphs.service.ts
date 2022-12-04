import { Injectable } from '@nestjs/common';
import { GraphInterface, TransitionInterface, NodeInterface } from './interfaces/graph.Interface';
@Injectable()
export class GraphsService {

    private readonly transitions: TransitionInterface = {
        '12': ['S', 'A', 'S'],
        '23': ['S', 'P', 'S'],
        '34': ['R', 'U', 'S'],
        '42': ['R', 'P', 'S'],
        '45': [['R', 'A', 'S'], ['R', 'P', 'B']],
        '52': ['R', 'P', 'S'],
        '51': ['R', 'A', 'S']
    }

    private readonly nodes: NodeInterface = {
        '1': ['2'],
        '2': ['3'],
        '3': ['4'],
        '4': ['5', '2'],
        '5': ['2', '1']
    }


    getNext(current: string): string[] {
        // returns the next value on the node
        return this.nodes[current]
    }



    getTransitions(visited: string[], current: string, destination: string): any {
        let next: any = undefined
        const nestedPaths: string[] = []
        const nestedVisits: any = []
        let transitions: string[] = []

        while (current !== destination) {
            visited.push(current)
            next = this.getNext(current)
            if (next.length > 1) {
                for (let valueInNext of next) {
                    if (visited.includes(valueInNext) && valueInNext === destination) {
                        next = [valueInNext]
                        break
                    } else if (!visited.includes(valueInNext) && valueInNext !== destination) {
                        next = [valueInNext]
                        const [paths, vv] = this.getTransitions([...visited, valueInNext], valueInNext, destination)
                        nestedPaths.push(paths)
                        nestedVisits.push(vv)
                        let [shortestPath]: string[] = nestedPaths.sort((a, b) => a.length - b.length);
                        let [shortestRecursive]: any = nestedVisits.sort((a, b) => a.size - b.size);
                        if (shortestRecursive.size < 5) {
                            transitions.push(`${current}${next}`)
                            const allTransitions = [...transitions, ...shortestPath]
                            return [allTransitions, shortestRecursive]
                        }


                    } else if (visited.includes(valueInNext) && valueInNext !== destination) {
                        continue
                    } else {
                        next = [valueInNext]
                    }


                }
            }
            transitions.push(`${current}${next}`)
            current = next[0]

        }

        return [[...transitions], new Set([...visited])]


    }


    getPath(transitionsToGetPath: string[]): string[] {
        const paths: string[] = []
        for (let transition of transitionsToGetPath) {
            paths.push(this.transitions[transition])
        }
        return paths

    }

    getInitialValues(statuses: any[]): any[] {

        statuses = statuses.join().split(',')
        const destination = statuses[0]
        const current = statuses[statuses.length - 1]
        const visited = statuses.slice(0, statuses.length - 1)
        return [visited, current, destination]
    }


    justOne(initialTransitionValue: string, initialTransitions: string): any {
        const statuses: number[] = Array.from(String(initialTransitions), Number);

        const [visited, current, destination] = this.getInitialValues(statuses)

        const transitionFromCurrent = this.getTransitions(visited, current, destination)[0]
        const paths: string[] = this.getPath(transitionFromCurrent)
        paths.unshift(initialTransitionValue)
        return [paths, transitionFromCurrent]
    }

    bothTransitionAndStatuses(statuses: string[]): GraphInterface {
        const initialTransitions = []

        for (let i: number = 0; i < statuses.length - 1; i++) {
            initialTransitions.push(`${statuses[i]}${statuses[i + 1]}`)

        }
        const [visited, current, destination] = this.getInitialValues(statuses)
        const transitionFromCurrent = this.getTransitions(visited, current, destination)[0]

        const allTransitions = initialTransitions.concat(transitionFromCurrent)
        const paths = this.getPath(allTransitions)


        return {
            "edges": paths,
            "transitions": allTransitions,

        }

    }

    checkIfArrayIsEquals(arr1: string[], arr2: string[]): boolean {
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    }

    getTransitionWhereValues(transitions: TransitionInterface, values: string[]): string[] {
        return Object.keys(transitions).filter(
            key => {
                if (typeof transitions[key][0] === 'object') {
                    for (let value of transitions[key]) {
                        if (this.checkIfArrayIsEquals(value, values)) {
                            return key
                        }
                    }
                }
                const areEqual = JSON.stringify(transitions[key]) === JSON.stringify(values);

                if (areEqual) {
                    return key
                }
            }
        );
    }

    parseInput(arr: string): string[] {
        let arrParsed: any = arr.replace(/'/g, '"') //replacing all ' with "
        arrParsed = JSON.parse(arrParsed)
        return arrParsed
    }

    getGraphResults(transition: any, statuses: any): GraphInterface {
        transition = this.parseInput(transition)
        statuses = statuses ? this.parseInput(statuses) : undefined
        if (!!(transition && statuses)) {
            return this.bothTransitionAndStatuses(statuses)
        }

        const transitionsToGetPaths = this.getTransitionWhereValues(this.transitions, transition)
        let pathLength: number = Infinity;
        let finalPath: string[] = []
        let shortestStartingNode: string = ''
        let winningTrans: string[] = []
        for (let transitionToGetPath of transitionsToGetPaths) {
            const [paths, ttt] = this.justOne(transition, transitionToGetPath.toString())

            if (paths.length < pathLength) {
                pathLength = paths.length
                finalPath = paths
                shortestStartingNode = transitionToGetPath;
                winningTrans = [shortestStartingNode, ...ttt]
            }

        }

        return {
            "edges": winningTrans,
            "transitions": finalPath,
        }
    }

}
