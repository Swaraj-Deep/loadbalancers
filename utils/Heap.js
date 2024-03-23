class MinHeap {
  constructor() {
    this.heap = [];
  }

  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasLeftChild(parentIndex) {
    return this.getLeftChildIndex(parentIndex) < this.heap.length;
  }

  hasRightChild(parentIndex) {
    return this.getRightChildIndex(parentIndex) < this.heap.length;
  }

  hasParent(childIndex) {
    return this.getParentIndex(childIndex) >= 0;
  }

  leftChild(parentIndex) {
    return this.heap[this.getLeftChildIndex(parentIndex)];
  }

  rightChild(parentIndex) {
    return this.heap[this.getRightChildIndex(parentIndex)];
  }

  parent(childIndex) {
    return this.heap[this.getParentIndex(childIndex)];
  }

  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  poll() {
    if (this.heap.length === 0) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return item;
  }

  add(item) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  removeByData(serviceId) {
    const indexToRemove = this.heap.findIndex(
      (item) => item.data.serviceId === serviceId
    );
    if (indexToRemove === -1) return false;

    const lastIndex = this.heap.length - 1;
    this.swap(indexToRemove, lastIndex);
    this.heap.pop();

    if (indexToRemove !== lastIndex) {
      const parentIndex = this.getParentIndex(indexToRemove);
      if (parentIndex !== -1) {
        if (this.heap[indexToRemove].key < this.heap[parentIndex].key) {
          this.heapifyDown(indexToRemove);
        } else {
          this.heapifyUp(indexToRemove);
        }
      }
    }

    return true;
  }

  updateByData(serviceId, requestNumber) {
    for (let i = 0; i < this.heap.length; i++) {
      if (this.heap[i].data.serviceId == serviceId) {
        const oldNode = this.heap[i];
        const newNode = { ...oldNode, key: requestNumber };
        this.heap[i] = newNode;
        this.heapifyDown(i);
        this.heapifyUp(i);
        break;
      }
    }
  }

  heapifyUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (
      currentIndex > 0 &&
      this.heap[currentIndex].key < this.heap[parentIndex].key
    ) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  heapifyDown(index) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);

    if (this.hasLeftChild(currentIndex)) {
      let smallestIndex = leftChildIndex;

      if (
        this.hasRightChild(currentIndex) &&
        this.heap[rightChildIndex].key < this.heap[leftChildIndex].key
      ) {
        smallestIndex = rightChildIndex;
      }

      if (this.heap[currentIndex].key > this.heap[smallestIndex].key) {
        this.swap(currentIndex, smallestIndex);
        this.heapifyDown(smallestIndex);
      }
    }
  }

  printHeap() {
    const result = [];
    this.levelOrderTraversal(result);
    console.log(result);
  }

  levelOrderTraversal(result) {
    const queue = [this.heap[0]];
    let currentIndex = 0;

    while (currentIndex < this.heap.length) {
      const node = queue.shift();
      result.push({ key: node.key, serviceId: node.data.serviceId });

      if (this.hasLeftChild(currentIndex)) {
        queue.push(this.leftChild(currentIndex));
      }

      if (this.hasRightChild(currentIndex)) {
        queue.push(this.rightChild(currentIndex));
      }

      currentIndex++;
    }
  }
}

const minHeap = new MinHeap();
module.exports = minHeap;

// minHeap.add({ key: 1, data: { serviceId: 0 } });
// minHeap.add({ key: 2, data: { serviceId: 0 } });
// minHeap.add({ key: 3, data: { serviceId: 0 } });

// minHeap.add({ key: 0, data: { serviceId: 0 } });
// minHeap.updateByData(0, 1);
// minHeap.updateByData(0, 2);
// minHeap.updateByData(0, 3);
// minHeap.updateByData(0, 999);
// minHeap.add({ key: 0, data: { serviceId: 1 } });
