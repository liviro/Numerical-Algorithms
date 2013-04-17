This folder contains several PDE solvers, both implicit (implicit-rod) and explicit (vibrating-string and explicit-rod). All of the PDE (partial differential equations) are solved by discretizing the equations and initial/boundary conditions (with respect to time/temperature/position, depending on the problem at hand), and then solving for a variable.

vibrating-string
----------------

This is the PDE for the position of a one-dimensional string that's being plucked, and then released. After discretization, the dependency is between 4 points: (x, t+k), (x-h, t), (x, t), (x+h, t) where h and k are the discretized position and time steps, respectively. As we want to solve for the next time step, given that the current time step is known, an equation for the value of (x, t+k) can be derived. As the y-position at (x, t+k) is independent of any other positions at time t+k, the solving is possible to paralellize (not done here, though). It is important to note that the solution is stable iff rho = k^2/h^2 <= 1. This is due to the error that comes with the discretization (stemming from Taylor's theorem, not shown here). 

explicit-rod
------------

This is the PDE for the temperature of a thin (one-dimensional) that has 1 ice-cold blocks pressed against its two ends. Straightforward discretization leads to the same dependency model as the vibrating string gave ((x, t+k), (x-h, t), (x, t), (x+h, t)), but with a different equation. However, the stability conditions are more strict: now, k/h^2 <= 1/2 (this is again due to Talyor's Theorem, originally). This implies that to guarantee stability, very small time steps (in comparison to the distance steps) are necessary, which is the main downside of using an explicit algorithm for this problem. 

Note that this also displays the error for the given solution, as a simple analytic solution can be found for the given PDE and the initial/boundary conditions. The error (for a given time) is the average of the errors for all positions for that time. TODO: make it more statistically sound. 