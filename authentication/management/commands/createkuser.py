from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import getpass


class Command(BaseCommand):
    help = 'Create a new user for the Kanban Board application'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username for the new user')
        parser.add_argument('--email', type=str, help='Email address for the user')
        parser.add_argument('--first-name', type=str, help='First name of the user')
        parser.add_argument('--last-name', type=str, help='Last name of the user')
        parser.add_argument('--superuser', action='store_true', help='Create a superuser')
        parser.add_argument('--password', type=str, help='Password (will prompt if not provided)')

    def handle(self, *args, **options):
        username = options['username']
        email = options.get('email', '')
        first_name = options.get('first_name', '')
        last_name = options.get('last_name', '')
        is_superuser = options.get('superuser', False)
        password = options.get('password')

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            raise CommandError(f'User with username "{username}" already exists.')

        # Validate email if provided
        if email and User.objects.filter(email=email).exists():
            raise CommandError(f'User with email "{email}" already exists.')

        # Get password if not provided
        if not password:
            while True:
                password = getpass.getpass('Password: ')
                password_confirm = getpass.getpass('Password (again): ')
                
                if password != password_confirm:
                    self.stdout.write(
                        self.style.ERROR('Error: Your passwords didn\'t match.')
                    )
                    continue
                
                if not password:
                    self.stdout.write(
                        self.style.ERROR('Error: Blank passwords aren\'t allowed.')
                    )
                    continue
                
                # Validate password strength
                try:
                    validate_password(password)
                    break
                except ValidationError as e:
                    for error in e.messages:
                        self.stdout.write(self.style.ERROR(f'Error: {error}'))
                    continue

        # Create the user
        try:
            if is_superuser:
                user = User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                user_type = "Superuser"
            else:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                user_type = "User"

            # Success message
            self.stdout.write(
                self.style.SUCCESS(
                    f'\n✅ {user_type} created successfully!\n'
                    f'   Username: {username}\n'
                    f'   Email: {email or "Not provided"}\n'
                    f'   Name: {first_name} {last_name}'.strip() or "Not provided"
                )
            )

            self.stdout.write(
                self.style.WARNING(
                    f'\n🔐 The user can now log in to the Kanban Board at:\n'
                    f'   Frontend: http://localhost:3000\n'
                    f'   API: http://localhost:8001/api/auth/login/'
                )
            )

        except Exception as e:
            raise CommandError(f'Error creating user: {str(e)}')

        return user