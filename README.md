# Coding Challenge

This was an interesting puzzle to tackle, with a couple of tricky pieces to consider.

## Decisions
Since the UI/UX was not the primary focus, and since we weren't operating a server of any kind, I opted to go for a vanilla `.ts`/`.html` approach, since I thought that React would be overkill. In hindsight, I'd forgotten how irksome it could be to deal with TS config settings, so I wish I'd just gone with a framework. It would have simplified the organization of functions and files too, allowing for easier export (I couldn't get around the TS compilation issues when trying to move custom types into their own file).

Looking at the grid system, I figured that a simple 2-D array would suffice. The only information we need to store in a particular grid square pertains to the "scent":
- does it have a scent?
- if it has a scent, to which movable coordinates does this scent pertain?

NOTE: upon writing this out, I feel like these could have been collapsed to a single property (e.g. `scentDirection`, which could be N, E, S, W, or `null`). This would greatly simplify things

THe other part of our program is the robot. Rather than building a class, I decided to go for another object, though with the amount of logic that was necessary, perhaps a class would have been better suited to handle all the methods.

We want to store on a particular robot:
- its coordinates
- its direction
- is it lost?

I also opted to store a "forwardCoordinate" property, but looking back this may have been unnecessary bloat for a calculation that could be done in the moment we're trying to move the robot.

### Direction

As for handling direction, I decided to utilize an enum for the possible directions, ordered in a specific way (clockwise, i.e. N E S W). This way, when we process a turn command, we can simply grab the robot's current direction, look up the corresponding index in the enum, add 1 if going right, subtract 1 if going left, and use modular arithmetic to get the next "sequential" direction.

## Next Steps

Unfortunately, I was not able to resolve the last "base" case re: processing a scent correctly. With the information stored in the grid for the second example robot, we should in theory just be able to check before every forward movement to see if there is a scent; if so, simply avoid going forward. In the code, this would entail ignoring the remainder of the "F" case in the switch block, however, I couldn't pin down the bug there. 

Assuming that was resolved, the next steps would have been to validate the input. If the user provided an improperly-formatted string, we could simply display a message telling them that the format was incorrect. With more time this could perhaps be enhanced to better explain the error, such as inclusion of an unsupported command (e.g. "P"). Ideally we would validate that the first line is the grid specification, and all remaining pairs of lines describe robot instructions.

From there I can see an outstanding edge case: what about robots overlapping? To me, this would fall under the same logic as our "scent" functionality. If a robot tries to move onto a grid square occupied by another robot, the command should be ignored.

Finally, I would want to add some unit tests to verify that functionality continues to work as expected. These could also include edge cases such as robots going off a corner (if another robot tried to go off the corner the other way, even though there's a scent, the scent doesn't warn about both "off-grid" directions from the corner).

Thank you for the opportunity to work on this interesting problem.
