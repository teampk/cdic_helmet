import sys

if __name__ == "__main__":

    # 환경변수가 없을 때
    if len(sys.argv) == 1:
        print('there is no environmental variable')

    # 환경변수가 한 개일 때 (for testing)
    elif len(sys.argv) ==2:

        print('hi')
    # 환경변수가 두 개일 때 (through Server)
    # sys.argv 1 -> 기기 id
    # sys.argv 2 -> 사진 생성 날짜 (사진 name)
    elif len(sys.argv) == 3:
        print(sys.argv[0])
        print(sys.argv[1])
        print(sys.argv[2])

    else:
        print('error')
