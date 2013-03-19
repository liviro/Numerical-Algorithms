# method that extracts necessary information from a file, if that kind of input is desired.
# format: line 0: dimension of matrices n (currently only works for square matrices w/ dimension of power of 2)
# lines 1 - n, n+1 - 2n: entires of the first and second matrices
def extract(input_file):
    data = open(input_file).read()
    data = data.split('\n')
    n = int(data[0])
    m1 = [0] * n
    m2 = [0] * n
    for a in range(n):
        m1[a] = [0]*n
        m2[a] = [0]*n
    for x in range(1,n+1):
        for y in range(n):
            m1[x-1][y] = float(data[x].split(' ')[y])
    for x in range(n+1, 2*n+1):
        for y in range(n):
            m2[x-n-1][y] = float(data[x].split(' ')[y])
    return n, m1, m2

# method that multiplies 2 matrices in the classic, definition-based, way. Input is 2 matrices.
# assumes matrix sizes are appropriate for multiplication (i.e. valid input)
def matrixMultClassic(a, b):
    x = len(a)
    y = len(b)
    z = len(b[0])
    res = [0]*x
    for p in range(x):
        res[p] = [0]*z
    for i in range(x):
        for j in range(z):
            for k in range(y):
                res[i][j] += a[i][k] * b[k][j]
    return res


# helper method that adds 2 matrices. Assumes matrices are of same dimensions.
def matrixAdd(a, b):
    x = len(a)
    y = len(a[0])
    res = [0]*x
    for p in range(x):
        res[p] = [0]*y
    for i in range(x):
        for j in range(y):
            res[i][j] += a[i][j] + b[i][j]
    return res

# helper method that subtracts 2 matrices. Assumes matrices are of same dimesions.
def matrixSub(a, b):
    x = len(a)
    y = len(a[0])
    res = [0]*x
    for p in range(x):
        res[p] = [0]*y
    for i in range(x):
        for j in range(y):
            res[i][j] += a[i][j] - b[i][j]
    return res

# helper method that splits a (square) matrix into four smaller matrices.  
def matrixSplit(a):                    
    l = len(a)
    half = l/2 
    a11 = half*[0]
    a12 = half*[0]  
    a21 = half*[0]
    a22 = half*[0]
    for p in range(half):
        a11[p] = [0]*half
        a12[p] = [0]*half
        a21[p] = [0]*half
        a22[p] = [0]*half
    for x in range(half):               
        for y in range(half):           
            a11[x][y] = a[x][y]
            a21[x][y] = a[x+half][y]
            a12[x][y] = a[x][y+half]
            a22[x][y] = a[x+half][y+half]
    return a11, a12, a21, a22

# helper method that combines 4 matrices into one bigger
def matrixCombine(a11, a12, a21, a22, n):
    a = n*[0]
    for p in range(n):
        a[p] = [0]*n
    for x in range(n/2):
        for y in range(n/2):
            a[x][y] = a11[x][y] 
            a[x+ n/2][y] = a21[x][y]
            a[x][y+ n/2] = a12[x][y]
            a[x+ n/2][y+ n/2] = a22[x][y] 
    return a             

# method that computes the product of 2 matrices using the classical, recursive algo
def classicRecursive(a, b, n):
    if n == 1:
        return [[a[0][0]*b[0][0]]]
    else:
        a11, a12, a21, a22 = matrixSplit(a)
        b11, b12, b21, b22 = matrixSplit(b)
        c11 = matrixAdd(classicRecursive(a11, b11, n/2), classicRecursive(a12, b21, n/2))
        c12 = matrixAdd(classicRecursive(a11, b12, n/2), classicRecursive(a12, b22, n/2))
        c21 = matrixAdd(classicRecursive(a21, b11, n/2), classicRecursive(a22, b21, n/2))
        c22 = matrixAdd(classicRecursive(a21, b12, n/2), classicRecursive(a22, b22, n/2))
        c = matrixCombine(c11, c12, c21, c22, n) 
        return c

# method that computes the product of 2 matrices using the Strassen algorithm
def strassen(a, b, n):
    if n == 1:
        return [[a[0][0]*b[0][0]]]
    else:
        a11, a12, a21, a22 = matrixSplit(a)
        b11, b12, b21, b22 = matrixSplit(b)
        q1 = strassen(matrixAdd(a11, a22) , matrixAdd(b11, b22), n/2)
        q2 = strassen(matrixAdd(a21, a22), b11, n/2)
        q3 = strassen(a11, matrixSub(b12, b22), n/2)
        q4 = strassen(a22, matrixSub(b21, b11), n/2)
        q5 = strassen(matrixAdd(a11, a12), b22, n/2)
        q6 = strassen(matrixSub(a21, a11), matrixAdd(b11, b12), n/2)
        q7 = strassen(matrixSub(a12, a22), matrixAdd(b21, b22), n/2)
        c11 = matrixAdd(matrixSub(q4, q5), matrixAdd(q1, q7)) 
        c12 = matrixAdd(q3, q5)
        c21 = matrixAdd(q2, q4)
        c22 = matrixAdd(matrixSub(q1, q2), matrixAdd(q3, q6))
        c = matrixCombine(c11, c12, c21, c22, n) 
        return c 
