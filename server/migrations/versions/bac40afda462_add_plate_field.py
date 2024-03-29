"""Add plate field

Revision ID: bac40afda462
Revises: 
Create Date: 2022-11-15 09:07:42.628933

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bac40afda462'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('_alembic_tmp_user')
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('plate', sa.String(length=10), server_default='ABC123', nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('plate')

    op.create_table('_alembic_tmp_user',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('username', sa.VARCHAR(length=80), nullable=False),
    sa.Column('password', sa.VARCHAR(length=100), nullable=True),
    sa.Column('email', sa.VARCHAR(length=120), nullable=False),
    sa.Column('created', sa.DATETIME(), nullable=False),
    sa.Column('bio', sa.TEXT(), nullable=True),
    sa.Column('admin', sa.BOOLEAN(), nullable=False),
    sa.Column('plate', sa.VARCHAR(length=10), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('plate', name='uq_user_plate'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###
