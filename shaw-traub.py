# evaluates the input polynomial a_0 x^n + a_1 x^(n-1) + ... + a_n and its (normalized) derivatives at an input value. 

# optional method that'll extract data from an input file, if input is desired in that way. 
# format: polynomial degree (integer) on line 1, 
# list of a_0, a_1, ..., a_n on line 2, 
# value at which to evaluate on line 3
def extract(input_file):
    data = open(input_file).read()
    data = data.split('\n')
    n = int(data[0])
    a = [0] * (n+1)
    for i in range(n+1):
        a[i] = float(data[1].split(' ')[i])
    x = float(data[2])
    return n, a, x


# method that evaluates the polynomial at its (normalized) derivatives. Uses the Shaw-Traub algorithm. 
# n = degree of polynomial, a = array of constant coefficients of polynomial, x = pt. of evaluation
def shaw_traub(n, a, x):
    # initialize matrix to store temporary values
    V = [0]*(n+2) 
    for l in range(n+2):
        V[l] = [0]*(n+1)
    # input top-row values:
    for i in range(n):
        V[0][i] = a[i+1]*x**(n-i-1) 
    # input diagonal values:
    for j in range(n+1):
        V[j+1][j] = a[0]*x**n 
    # calculate the remaining values:
    for j in range(n):
        for i in range(j+1, n+1):
            V[j+1][i] = V[j][i-1]+V[j+1][i-1]
    # output results (rightmost column of matrix):
    for j in range(n+1): 
        print 'Normalized Derivative #'+str(j)+' : '+str(V[j+1][n]/x**j)


# method that ties together the input method & shaw-traub method, to automate. 
def shaw_traub_input(input_file): 
    n, a, x = extract(input_file)
    print "File "+input_file
    shaw_traub(n, a, x)
