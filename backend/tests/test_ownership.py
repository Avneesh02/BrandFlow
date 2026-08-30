from app.models import Campaign, User
from app.core.security import hash_password


def test_ownership_check(client, db_session):
    user_a = User(email="a@test.com", hashed_password=hash_password("password123"))
    user_b = User(email="b@test.com", hashed_password=hash_password("password123"))
    db_session.add_all([user_a, user_b])
    db_session.commit()

    campaign = Campaign(
        user_id=user_a.id,
        product="Tea",
        audience="Everyone",
        objective="Sales",
        platform="Instagram",
        tone="Warm",
        used_rag=False,
    )
    db_session.add(campaign)
    db_session.commit()

    # login as user B
    login = client.post("/api/auth/login", json={"email": "b@test.com", "password": "password123"})
    token = login.json()["access_token"]

    resp = client.get(f"/api/campaigns/{campaign.id}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 404
