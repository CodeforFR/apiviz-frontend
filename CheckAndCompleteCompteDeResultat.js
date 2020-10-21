/**
The function checkTreeData takes a CompteDeResultat tree like the one in "arbreCompteDeResultat.json" file,
where every child should have been filled with data , which consist of a new member like :
data = {
  code : string,
  description : string,
  value : integer,
  status : "official"
}
*/
export function checkTreeData( item ) {
  if (!item.data)
  {
    console.log(" from item :", item)
    item.data = {
      code : item.codeLiasses.toString(),
      description : "non fourni",
      value : undefined,
      status : "missing" }
  }
  if (item.children)
  {
    for (var childName in item.children)
    {
      checkTreeData(item.children[childName])
    }

    // Compute ourself item's value from its children
    var computedSum = 0 // Result from official children's value
    var computedSumFromComputed = 0 // Result from computed children's value
    var childMissingCount = 0 // Count of child without value officially given
    for (var childName in item.children)
    {
      var child = item.children[childName]
      if (child.data.value)
      {
        computedSum += child.data.value * (child.sign ? -1 : 1)
        computedSumFromComputed += child.data.value * (child.sign ? -1 : 1)
      }
      else
      {
        childMissingCount += 1
        if (child.data.computedValue)
        {
          computedSumFromComputed += child.data.computedValue * (child.sign ? -1 : 1)
        }
      }
    }

    if (item.data.value) {
      // If official value match computed value from official children's value with less than 0.5% error
      if (Math.abs((computedSum - item.data.value) / item.data.value) < 0.005
          || Math.abs(computedSum - item.data.value) < 10)
      {
        item.data.status = "checked"
        // Fix children values if needed
        for (var childName in item.children)
        {
          setToZeroComputed(item.children[childName])
        }
      }
      // If official value match computed value from computed children's value with less than 0.5% error
      else if (Math.abs((computedSumFromComputed - item.data.value) / item.data.value) < 0.005
               || Math.abs(computedSumFromComputed - item.data.value) < 10)
      {
        item.data.status = "checked"
        // Fix children values if needed
        for (var childName in item.children)
        {
          if (item.children[childName].data.value == undefined )
          {
            item.children[childName].data.value = item.children[childName].data.computedValue
            item.children[childName].data.status = "computed"
          }
        }
        computedSum = computedSumFromComputed
      }
      // If there is only on value missing from children, set this child's value equal to the computed difference
      else if (childMissingCount == 1)
      {
        for (var childName in item.children)
        {
          var child = item.children[childName]
          if (!child.data.value)
          {
            item.children[childName].data.computedValue = computedSum - item.data.value
            item.children[childName].data.value = item.children[childName].data.computedValue
            item.children[childName].data.status = "computed"
            item.data.status = "checked"
            break;
          }
        }
      }
      else {
        item.data.status = "error"
      }
    }
    if (computedSum != item.data.value)
    {
      console.log("computed sum : ", computedSum, "computed sum from computed : ", computedSumFromComputed, " and given sum : ", item.data.value, " diff en pour 100 : ", ((computedSum - item.data.value)*100 / item.data.value))
      item.data.computedValue = computedSum
    }
  }
}

function setToZeroComputed ( item )
{
  console.log("setToZeroComputed called for : ", item.name, item.data)
  if (item.data.value == undefined && (item.data.computedValue == undefined || item.data.computedValue == 0))
  {
    item.data.value = 0
    item.data.status = "computed"
    for (var childName in item.children)
    {
      setToZeroComputed(item.children[childName])
    }
  }
}