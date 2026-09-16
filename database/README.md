# AthleteVision AI — Database

PostgreSQL database for AthleteVision AI.

## Structure

```text
AthleteVision-AI/
├── docker-compose.yml
└── database/
    ├── schema.sql
    └── README.md
```

`docker-compose.yml` is in the **project root** and automatically initializes PostgreSQL using `database/schema.sql`.

## Run the Database

From the project root:

```bash
cd AthleteVision-AI
docker compose up -d
```

Check status:

```bash
docker compose ps
```

The PostgreSQL container should show as **healthy**.

## Database Details

```text
Database: athletevision
Username: athletevision
Password: athletevision_dev_password
Host: localhost
Port: 5433
```

Docker maps:

```text
localhost:5433 → PostgreSQL:5432
```

Port `5433` is used to avoid conflicts with an existing local PostgreSQL installation.

## Verify Tables

```bash
docker exec -it athletevision-postgres \
psql -U athletevision -d athletevision
```

Then:

```sql
\dt
```

Expected tables:

```text
users
athletes
videos
performance_metrics
talent_scores
performance_reports
```

Exit with:

```sql
\q
```

## Spring Boot Connection

When Spring Boot runs directly on the host machine:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/athletevision
spring.datasource.username=athletevision
spring.datasource.password=athletevision_dev_password
spring.jpa.hibernate.ddl-auto=validate
```

`schema.sql` is the database source of truth. Hibernate should validate the JPA entities against it rather than modify the schema.

## Reset Database

To completely reset the local Docker database:

```bash
docker compose down -v
docker compose up -d
```

**Warning:** this deletes the local database data and recreates it from `database/schema.sql`.

## Current Status

* PostgreSQL schema implemented and tested
* Docker PostgreSQL configured
* Schema initialization verified
* Ready for Spring Boot integration
