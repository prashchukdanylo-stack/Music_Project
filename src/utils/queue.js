class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item, priority) {
        this.items.push({item, priority, timestamp: Date.now()});
        
    }
    peek(kind) {
        if (this.items.length === 0) return null;
        
        switch (kind) {
            case "highestPriority":
                return this.items.reduce((prev, current)=> {
                    if (current.priority > prev.priority) {
                        return current;
                    }
                    return prev;
                })
            case "lowestPriority":
                 return this.items.reduce((prev, current)=> {
                    if (current.priority < prev.priority) {
                        return current;
                    }
                    return prev;
                })
            case "oldest":
                return this.items.reduce((prev, current) => {
                    if (current.timestamp < prev.timestamp) {
                        return current;
                    }
                    return prev;
                })
            case "newest":
                return this.items.reduce((prev, current) => {
                    if (current.timestamp > prev.timestamp) {
                        return current;
                    }
                    return prev;
                })
        }
    }
}
export default Queue;