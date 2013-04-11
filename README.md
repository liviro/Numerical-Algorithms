Numerical Algorithms
====================

Collection of mathematical stuff, for the most part encountered in different courses, coded in Python. 

shaw-traub.py
-------------

Shaw-Traub algorithm: a method that evaluates a polynomial of degree _n_ and its n (normalized) derivatives, 
including the 0th (simple polynomial evaluation). The explanation of this method can be found in the following 
paper: http://posner.library.cmu.edu/Collections/traub62/box00027/fld00070/bdl0001/doc0001/doc_27b70f1b1.pdf
(starting from p. 6). The Shaw-Traub algorithm is an alternative to the Horner algorithm. The Horner 
algorithm uses n(n+1)/2 multiplications, and as many additions. In contrast, the Shaw-Traub algorithm
uses 3n-2 multiplications, and n(n+1)/2 additions. Thus, the number of multiplications needed went from 
quadratic to linear. 

The algorithm works by creating a matrix, and initializing the topmost (0th) row and a diagonal, in which
all of the multiplications are done. The filling out of all other values require only additions, which 
is what allows the algorithm to use so few multiplications. 


strassen.py
-----------

Strassen method: an alternative way of multiplying matrices, which takes O(n^(lg 7)) ~ O(n^2.8) time, while 
the 'classic' way of multiplying (by definition, using dot product) takes O(n^3) time. This difference is 
due to the fact that the Strassen algorithm requires only 7 multiplications at each recursive step, while 
the classic algorithm needs 8. The Strassen, classic recursive, and classic non-recursive multiplication
methods are provided in this file. They were written with only the basic mathematical operations assumed - 
addition, subtraction, multiplication, division. All matrix operations were written (hence the relatively
large number of helper methods).

Currently, the recursive methods (Strassen and the classic recursive) only support multiplication of square
matrices of dimensions that are a power of 2, but this restriction may be lifted by modifying the helper 
methods that split / combine matrices into smaller / bigger ones, respectively.


monte-carlo.py
--------------

Monte Carlo method for evaluating high-dimensional integrals. This program does it only for 3 dimensions, but
could easily be extrapolated into higher ones. This algorithm works by randomly sampling values of the 
function that's being integrated in the integral interval, summing these samples, multiplying by the volume
of the box that's being integrated over (assume cartesian coordinate system), and then divided by the number of
sample points taken. Contrast this with the classical way integrals are defined. 

Why is randomness necessary? Assume that the integral is over 360 dimensions (think of 30 a year mortgage with 
montly payments). A way to calculate the integral (from here on, calculate = approximate, as these integrals
aren't being solved analytically) is to establish a grid of desired finesse, calculate the function values at 
these points, add them up, multiply by the volume of the "box" of integration, then divide by number of sample 
points. The horror comes up when we start discovering how many evaluations are actually necessary. Assume 
without loss of generality that the integration is done over a box with all side lengths of length 1 (scaling),
and that we have a grid in which there are m gridpoints in each unit of length. Let's make this example coarse, 
and have m=2. We would have to do 2^360 evaluations for this example. Assume that each each evaluation takes 
2^(-36) seconds (which is already very optimistic). Then it would still take 2^(324) seconds, which is longer
than the age of the universe. There is no way to break this so-called curse of dimensionality by a clever 
algorithm, because this exponential complexity is a property of the problem. 

Randomness breaks the curse by replacing the error by an expected error. In this particular example, 
expected error = sqrt( var(f) / n ) (where var is the variance of the function, and n is the number of points 
used for the sampling). Note that the error may be greater than the expected error! (Although the probability
of that is relatively low, and is given by the Chebyshev inequality). 

Randomness? There are different ways to go about that. This program allows for both truly random sample points, 
as well as pseudo-random sample points. The truly random points are gotten by requesting random bits from 
random.org (careful, you have only a limited amount of random bits available every day!), and the pseudo-random
are gotten from Python's random library. A new option was added: using (truly) random numbers that're generated
from the OS. In UNIX-based systems, this draws from /dev/urandom, and on Windows, it uses CryptGenRandom. This
is easily done using the os.urandom() method of Python (which was introduced in v. 2.4), which, in turn, is used
by the SystemRandom() class of the random library of Python. Note that this method may not work for some 
obscure operating systems.

TODO: Quasi-Monte Carlo (using low-discrepancy sequences).


vibrating-string
----------------

This is the visualization of the numeric solution of the partial differential equation for a vibrating, 1-dimensional string. For more info, look at the readme of that folder.