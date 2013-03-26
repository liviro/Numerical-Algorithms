import math
import urllib
import httplib
import time


# Example function 
def f(x,y,z):
    return y*x**2+math.exp(-z)

# Small helper to get a random value from given interval
def randInIntvl(randomList, low, high):
    diff = high - low
    return diff*randomList.pop()+low

# Returns a list 6*n of truly random numbers from random.org, range (0, 1)
def getRandom(n):
    hdr= { 'User-Agent' : 'Monte Carlo integrator, by polina.viro@gmail.com'}
    conn = httplib.HTTPConnection('www.random.org')
    randList = []
    for i in range(int(math.ceil(6*n/1000.))):
        conn.request('GET', '/integers/?num=1000&min=1&max=10000&col=1&base=10&format=plain&rnd=new', headers=hdr)
        randString = conn.getresponse().read()
        conn.close()
        randRaw = randString.rstrip().split('\n')
        for j in range(len(randRaw)):
            randList.append(float(randRaw[j])/10**4)
        time.sleep(2)
    return randList

# Main method that'll do the integration
def monteCarlo(f,n,a1,b1,a2,b2,a3,b3, randList):
    s = 0                               
    vol = (b1-a1)*(b2-a2)*(b3-a3)
    for i in range(n):                
        s += f(randInIntvl(randList, a1, b1),randInIntvl(randList, a2, b2),randInIntvl(randList, a3, b3))
    ans = vol*s/n
    return ans
