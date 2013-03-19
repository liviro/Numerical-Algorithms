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