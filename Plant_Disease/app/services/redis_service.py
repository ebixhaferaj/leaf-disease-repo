import aioredis
from app.core.config import REDIS_HOST, REDIS_PORT

JTI_EXPIRE_SECONDS = 3600

token_blocklist = aioredis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=0
)

# Add token to blocklist
async def add_jti_to_blocklist(jti: str) -> None:
    await token_blocklist.set(name=jti,value="",ex=JTI_EXPIRE_SECONDS)


# Get token from blocklist
async def token_in_blocklist(jti: str) -> bool:
    jti = await token_blocklist.get(jti)

    return jti is not None
