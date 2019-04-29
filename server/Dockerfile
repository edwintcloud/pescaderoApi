FROM golang:alpine as builder

RUN mkdir /server
WORKDIR /server
COPY go.mod .
COPY go.sum .

RUN apk add --update --no-cache ca-certificates git

RUN go mod download
COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build 
FROM alpine:latest

RUN mkdir /server
WORKDIR /server

COPY --from=builder /server/server .

CMD ["./server"]