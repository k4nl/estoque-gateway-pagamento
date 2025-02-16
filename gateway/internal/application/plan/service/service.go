package planservice

import (
	"fmt"
	"gateway/config/events"
	plandto "gateway/internal/application/plan/dto"
	transactionservice "gateway/internal/application/transaction/service"
	"gateway/internal/domain/application/transaction"
	"gateway/internal/domain/application/user"
	"gateway/internal/infrastructure/repository"

	"github.com/google/uuid"
)

type PlanService struct {
	database           *repository.Repository
	producer           *events.TransactionProducer
	transactionService *transactionservice.TransactionService
}

func NewPlanService(database *repository.Repository, producer *events.TransactionProducer, transactionService *transactionservice.TransactionService) *PlanService {
	return &PlanService{database: database, producer: producer, transactionService: transactionService}
}

func (ps PlanService) UpgradePlanRequest(upgradePlanDto plandto.UpgradePlanDTO, client user.Client) (*transaction.PaymentTransaction, error) {

	plan := ps.database.FindPlanById(upgradePlanDto.PlanID)

	if plan == nil {
		return nil, fmt.Errorf("plan not found")
	}

	qrcode, err := ps.transactionService.CreateQrcode(client.ID, plan.Price, transaction.UpgradePlan)

	if err != nil {

		return nil, err
	}

	return qrcode, nil

}

func (ps PlanService) UpgradePlan(planID uuid.UUID, client user.Client) (*transaction.PaymentTransaction, error) {

	plan := ps.database.FindPlanById(planID)

	if plan == nil {
		return nil, fmt.Errorf("plan not found")
	}

	plan2 = plan.New()

}
