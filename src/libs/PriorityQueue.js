export default class PriorityQueue {
  constructor(comparator = (a, b) => a < b) {
    this.values = [];
    this.comparator = comparator;
  }

  push(element) {
    this.values.push(element);
    this._bubbleUp();
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }

    const max = this.values[0];
    const end = this.values.pop();

    if (this.values.length > 0) {
      this.values[0] = end;
      this._bubbleDown();
    }

    return max;
  }

  peek() {
    return this.values[0] || null;
  }

  isEmpty() {
    return this.values.length === 0;
  }

  _bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.values[parentIdx];

      if (!this.comparator(element, parent)) {
        break;
      }

      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }

  _bubbleDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];

    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (this.comparator(leftChild, element)) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && this.comparator(rightChild, element)) ||
          (swap !== null && this.comparator(rightChild, leftChild))
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;

      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}
