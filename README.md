Numerical-Algorithms
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