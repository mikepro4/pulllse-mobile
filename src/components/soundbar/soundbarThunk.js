function modifyObjectArray(objects) {
  const targetLength = 60;

  // If the object array is longer than 60
  if (objects.length > targetLength) {
    const removalInterval = objects.length / (objects.length - targetLength);
    let removalCounter = 0;

    // Filter the objects, removing some at regular intervals
    objects = objects.filter((object, index) => {
      removalCounter += 1;
      if (removalCounter >= removalInterval) {
        removalCounter -= removalInterval;
        return false;
      }
      return true;
    });
  }
  // If the object array is shorter than 60
  else if (objects.length < targetLength) {
    const initialLength = objects.length;
    const objectsToAdd = targetLength - initialLength;
    let ratio = Math.ceil(objectsToAdd / initialLength);

    let index = 0;
    while (objects.length < targetLength && index < objects.length) {
      // Keep original objects
      index++;

      // Insert new objects
      for (let j = 0; j < ratio && objects.length < targetLength; j++) {
        const newObject = {
          id: Math.random().toString(36).substring(2),
          rawValue: -45,
        };
        objects.splice(index, 0, newObject);
        index++;
      }
    }
  }

  return objects;
}

export { modifyObjectArray };
