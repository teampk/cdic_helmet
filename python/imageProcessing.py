import cv2
import sys
import numpy as np
import time


def get_output_layers(net):

    layer_names = net.getLayerNames()
    output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    return output_layers


def draw_prediction(img, class_id, confidence, x, y, x_plus_w, y_plus_h):
    label = str(classes[class_id])
    color = COLORS[class_id]
    cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), color, 2)
    cv2.putText(img, label, (x-10, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)


if __name__ == "__main__":

    args_classes = "./yolov3.txt"
    args_weights = "./yolov3.weights"
    args_config = "./yolov3.cfg"

    # 환경변수가 없을 때 (for testing)
    if len(sys.argv) == 1:
        print("MODE 0")
        image_file = "../public/images/input_image/dog.jpg"
        image = cv2.imread(image_file)
        image_gs = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 환경변수가 한 개일 때 (for testing)
    # sys.argv 1 -> 이미지 name
    elif len(sys.argv) == 2:
        start_time = time.time()
        print("MODE 1 (argv:"+sys.argv[1]+")")
        image_file = "../public/images/input_image/" + sys.argv[1]
        image = cv2.imread(image_file)
        width = image.shape[1]
        height = image.shape[0]
        scale = 0.00392
        classes = None

        # 물체인식 할 물체 목록 class 들
        with open(args_classes, 'r') as f:
            classes = [line.strip() for line in f.readlines()]
        COLORS = np.random.uniform(0, 255, size=(len(classes), 3))
        net = cv2.dnn.readNet(args_weights, args_config)
        blob = cv2.dnn.blobFromImage(image, scale, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)

        outs = net.forward(get_output_layers(net))

        class_ids = []
        confidences = []
        boxes = []
        conf_threshold = 0.5
        nms_threshold = 0.4

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    x = center_x - w / 2
                    y = center_y - h / 2
                    class_ids.append(class_id)
                    confidences.append(float(confidence))
                    boxes.append([x, y, w, h])

        indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)

        for i in indices:
            i = i[0]
            box = boxes[i]
            x = box[0]
            y = box[1]
            w = box[2]
            h = box[3]
            draw_prediction(image, class_ids[i], confidences[i], round(x), round(y), round(x + w), round(y + h))
        perform_time = time.time() - start_time
        print("수행시간:"+str(perform_time))
        cv2.imshow("object detection", image)
        cv2.waitKey()

        cv2.imwrite("object-detection.jpg", image)
        cv2.destroyAllWindows()

    # 환경변수가 두 개일 때 (through Server)
    # sys.argv 1 -> 기기 id
    # sys.argv 2 -> 이미지 name (사진 생성 날짜)
    elif len(sys.argv) == 3:
        print("MODE 2")

    else:
        print("ERROR")