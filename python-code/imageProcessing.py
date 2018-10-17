import sys

if __name__ == "__main__":

    # 환경변수가 없을 때
    if len(sys.argv) == 1:
        print('there is no environmental variable')

    # 환경변수가 두개일 때
    elif len(sys.argv) == 3:
        mode0 = sys.argv[0]
        mode1 = sys.argv[1]
        mode2 = sys.argv[2]
        print(mode0)
        print(mode1)
        print(mode2)

    else:
        print('error')
