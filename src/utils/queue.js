class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(item, priority) {

        const existingIndex = this.items.findIndex(i => i.item.id === item.id);
        if (existingIndex !== -1) {
            this.items[existingIndex].priority = priority;
            this.sortItems();
        } else {
            this.items.push({item, priority});
            this.sortItems();
        }
        return this;
        
    }

    sortItems() {
        this.items.sort((a, b) => b.priority - a.priority);
    }

    peek(kind) {
       if (this.items.length === 0) return null;

       if (kind === "highest") {
        return this.items[0];
       } else if (kind === "lowest") {
        return this.items[this.items.length - 1];
       }
    }

    dequeue(kind) {
        if (this.items.length === 0) return null;
        
        if (kind === "highest") {
            return this.items.shift();
        } else if (kind === "lowest") {
            return this.items.pop();
        }
    }
}
export default PriorityQueue;