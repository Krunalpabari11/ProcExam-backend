import Redis from 'ioredis'

export const redisClient=new Redis({
    port: 18342, 
    host: "redis-18342.c100.us-east-1-4.ec2.redns.redis-cloud.com",
    username: "default",
    password: "vRjLYzie5qejQag0ZGhz8nBU919tOhAn",
    db: 0, 
  });
