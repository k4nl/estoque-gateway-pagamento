package plancontroller

import (
	"encoding/json"
	plandto "gateway/internal/application/plan/dto"
	planservice "gateway/internal/application/plan/service"
	"gateway/internal/domain/application/user"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PlanController struct {
	PlanService *planservice.PlanService
}

func NewPlanController(planService *planservice.PlanService) *PlanController {
	return &PlanController{PlanService: planService}
}

func (pc PlanController) UpgradePlan(c *gin.Context) {

	var upgradePlanDto plandto.UpgradePlanDTO

	err := json.NewDecoder(c.Request.Body).Decode(&upgradePlanDto)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": "Invalid request body"})
		return
	}

	client, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Message": "Unauthorized"})
		return
	}

	clientData, ok := client.(user.Client)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"Message": "Unauthorized"})
	}

	err = plandto.ValidatePayment(upgradePlanDto.PaymentType, upgradePlanDto.CreditCard)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	qrcode, err := pc.PlanService.UpgradePlan(upgradePlanDto, clientData)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"qrcode": qrcode})
}
