import re

def processFile(filename):
  cargoParts = {}
  instructions = []

  with open(filename, encoding = 'utf-8') as f:
    for line in f:
      if (line.startswith('move')):
        instructions.append(line.strip())
      elif (line != ''):
        cargoPart = processCargoLine(line, 4)
        for part in cargoPart:
          stackNumber = part.get('stack')
          crateId = part.get('crate')
          assignCreateToCargo(stackNumber, crateId, cargoParts)
  return { 'cargo': cargoParts, 'instructions': instructions }

def processCargoLine(cargoLine, offset):
  return [({ "stack": match.start(0) // offset + 1, "crate": cargoLine[match.start(0) + 1]}) for match in re.finditer("\[\S\]", cargoLine)]

def assignCreateToCargo(stackNumber, crateId, container):
  if (container.get(stackNumber)):
    container[stackNumber] = [crateId] + container[stackNumber]
  else:
    container[stackNumber] = [crateId]

def applyInstruction(cargoParts, instruction):
  [amountOfCrates, source, destination] = map(int, filter(lambda x: x.isdigit(), instruction.split()))
  sourceCargo = cargoParts[source]
  destinationCargo = cargoParts[destination]
  cratesToMove = sourceCargo[len(sourceCargo) - amountOfCrates:] if len(sourceCargo) >= amountOfCrates else sourceCargo
  newSourceCargo =  sourceCargo[:len(sourceCargo) - amountOfCrates] if len(sourceCargo) >= amountOfCrates else []

  return { **cargoParts, destination: destinationCargo + cratesToMove, source: newSourceCargo }

def applyInstructions(cargoParts, instructions): 
  for instruction in instructions:
    cargoParts = applyInstruction(cargoParts, instruction)

  return ' '.join([v.pop() if v else '' for (_, v) in sorted(cargoParts.items())])

processed = processFile('input.txt')

result = applyInstructions(processed.get('cargo'), processed.get('instructions'))

print(result)
