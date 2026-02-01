
curl -X POST "http://localhost:3400/api/load-tests" \
  -H "Content-Type: application/json" \
  -H "x-user-email: sd3Test@example.com" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "GET",
    "totalRequests": 100,
    "concurrency": 10,
    "headers": {},
    "payload": null
  }'


curl -X GET "http://localhost:3400/api/load-tests" \
  -H "x-user-email: sd3Test@example.com" \


curl -X GET "http://localhost:3400/api/load-tests/{testId}/status" \
  -H "x-user-email: sd3Test@example.com" \


curl -X GET "http://localhost:3400/api/load-tests/{testId}/result" \
  -H "x-user-email: sd3Test@example.com" \

curl --location 'http://localhost:3400/api/load-tests/results?method=GET&minThroughput=50&maxThroughput=100&minErrorRate=30&maxErrorRate=100&url=111' \
--header 'x-user-email: sd3Test@example.com'
